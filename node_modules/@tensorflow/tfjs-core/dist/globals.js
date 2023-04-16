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
import { ENGINE } from './engine';
import { env } from './environment';
import { setDeprecationWarningFn } from './tensor';
import { getTensorsInContainer } from './tensor_util';
/**
 * Enables production mode which disables correctness checks in favor of
 * performance.
 *
 * @doc {heading: 'Environment'}
 */
export function enableProdMode() {
    env().set('PROD', true);
}
/**
 * Enables debug mode which will log information about all executed kernels:
 * the elapsed time of the kernel execution, as well as the rank, shape, and
 * size of the output tensor.
 *
 * Debug mode will significantly slow down your application as it will
 * download the result of every operation to the CPU. This should not be used in
 * production. Debug mode does not affect the timing information of the kernel
 * execution as we do not measure download time in the kernel execution time.
 *
 * See also: `tf.profile`, `tf.memory`.
 *
 * @doc {heading: 'Environment'}
 */
export function enableDebugMode() {
    env().set('DEBUG', true);
}
/** Globally disables deprecation warnings */
export function disableDeprecationWarnings() {
    env().set('DEPRECATION_WARNINGS_ENABLED', false);
    console.warn(`TensorFlow.js deprecation warnings have been disabled.`);
}
/** Warn users about deprecated functionality. */
export function deprecationWarn(msg) {
    if (env().getBool('DEPRECATION_WARNINGS_ENABLED')) {
        console.warn(msg + ' You can disable deprecation warnings with ' +
            'tf.disableDeprecationWarnings().');
    }
}
setDeprecationWarningFn(deprecationWarn);
/**
 * Dispose all variables kept in backend engine.
 *
 * @doc {heading: 'Environment'}
 */
export function disposeVariables() {
    ENGINE.disposeVariables();
}
/**
 * It returns the global engine that keeps track of all tensors and backends.
 *
 * @doc {heading: 'Environment'}
 */
export function engine() {
    return ENGINE;
}
/**
 * Returns memory info at the current time in the program. The result is an
 * object with the following properties:
 *
 * - `numBytes`: Number of bytes allocated (undisposed) at this time.
 * - `numTensors`: Number of unique tensors allocated.
 * - `numDataBuffers`: Number of unique data buffers allocated
 *   (undisposed) at this time, which is ≤ the number of tensors
 *   (e.g. `a.reshape(newShape)` makes a new Tensor that shares the same
 *   data buffer with `a`).
 * - `unreliable`: True if the memory usage is unreliable. See `reasons` when
 *    `unreliable` is true.
 * - `reasons`: `string[]`, reasons why the memory is unreliable, present if
 *    `unreliable` is true.
 *
 * WebGL Properties:
 * - `numBytesInGPU`: Number of bytes allocated (undisposed) in the GPU only at
 *     this time.
 *
 * @doc {heading: 'Performance', subheading: 'Memory'}
 */
export function memory() {
    return ENGINE.memory();
}
/**
 * Executes the provided function `f()` and returns a promise that resolves
 * with information about the function's memory use:
 * - `newBytes`: the number of new bytes allocated
 * - `newTensors`: the number of new tensors created
 * - `peakBytes`: the peak number of bytes allocated
 * - `kernels`: an array of objects for each kernel involved that reports
 * their input and output shapes, number of bytes used, and number of new
 * tensors created.
 * - `kernelNames`: an array of unique strings with just the names of the
 * kernels in the `kernels` array.
 *
 * ```js
 * const profile = await tf.profile(() => {
 *   const x = tf.tensor1d([1, 2, 3]);
 *   let x2 = x.square();
 *   x2.dispose();
 *   x2 = x.square();
 *   x2.dispose();
 *   return x;
 * });
 *
 * console.log(`newBytes: ${profile.newBytes}`);
 * console.log(`newTensors: ${profile.newTensors}`);
 * console.log(`byte usage over all kernels: ${profile.kernels.map(k =>
 * k.totalBytesSnapshot)}`);
 * ```
 *
 *
 * @doc {heading: 'Performance', subheading: 'Profile'}
 */
export function profile(f) {
    return ENGINE.profile(f);
}
/**
 * Executes the provided function `fn` and after it is executed, cleans up all
 * intermediate tensors allocated by `fn` except those returned by `fn`.
 * `fn` must not return a Promise (async functions not allowed). The returned
 * result can be a complex object.
 *
 * Using this method helps avoid memory leaks. In general, wrap calls to
 * operations in `tf.tidy` for automatic memory cleanup.
 *
 * NOTE: Variables do *not* get cleaned up when inside a tidy(). If you want to
 * dispose variables, please use `tf.disposeVariables` or call dispose()
 * directly on variables.
 *
 * ```js
 * // y = 2 ^ 2 + 1
 * const y = tf.tidy(() => {
 *   // a, b, and one will be cleaned up when the tidy ends.
 *   const one = tf.scalar(1);
 *   const a = tf.scalar(2);
 *   const b = a.square();
 *
 *   console.log('numTensors (in tidy): ' + tf.memory().numTensors);
 *
 *   // The value returned inside the tidy function will return
 *   // through the tidy, in this case to the variable y.
 *   return b.add(one);
 * });
 *
 * console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
 * y.print();
 * ```
 *
 * @param nameOrFn The name of the closure, or the function to execute.
 *     If a name is provided, the 2nd argument should be the function.
 *     If debug mode is on, the timing and the memory usage of the function
 *     will be tracked and displayed on the console using the provided name.
 * @param fn The function to execute.
 *
 * @doc {heading: 'Performance', subheading: 'Memory'}
 */
export function tidy(nameOrFn, fn) {
    return ENGINE.tidy(nameOrFn, fn);
}
/**
 * Disposes any `tf.Tensor`s found within the provided object.
 *
 * @param container an object that may be a `tf.Tensor` or may directly
 *     contain `tf.Tensor`s, such as a `Tensor[]` or `{key: Tensor, ...}`. If
 *     the object is not a `tf.Tensor` or does not contain `Tensors`, nothing
 *     happens. In general it is safe to pass any object here, except that
 *     `Promise`s are not supported.
 *
 * @doc {heading: 'Performance', subheading: 'Memory'}
 */
export function dispose(container) {
    const tensors = getTensorsInContainer(container);
    tensors.forEach(tensor => tensor.dispose());
}
/**
 * Keeps a `tf.Tensor` generated inside a `tf.tidy` from being disposed
 * automatically.
 *
 * ```js
 * let b;
 * const y = tf.tidy(() => {
 *   const one = tf.scalar(1);
 *   const a = tf.scalar(2);
 *
 *   // b will not be cleaned up by the tidy. a and one will be cleaned up
 *   // when the tidy ends.
 *   b = tf.keep(a.square());
 *
 *   console.log('numTensors (in tidy): ' + tf.memory().numTensors);
 *
 *   // The value returned inside the tidy function will return
 *   // through the tidy, in this case to the variable y.
 *   return b.add(one);
 * });
 *
 * console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
 * console.log('y:');
 * y.print();
 * console.log('b:');
 * b.print();
 * ```
 *
 * @param result The tensor to keep from being disposed.
 *
 * @doc {heading: 'Performance', subheading: 'Memory'}
 */
export function keep(result) {
    return ENGINE.keep(result);
}
/**
 * Executes `f()` and returns a promise that resolves with timing
 * information.
 *
 * The result is an object with the following properties:
 *
 * - `wallMs`: Wall execution time.
 * - `kernelMs`: Kernel execution time, ignoring data transfer. If using the
 * WebGL backend and the query timer extension is not available, this will
 * return an error object.
 * - On `WebGL` The following additional properties exist:
 *   - `uploadWaitMs`: CPU blocking time on texture uploads.
 *   - `downloadWaitMs`: CPU blocking time on texture downloads (readPixels).
 *
 * ```js
 * const x = tf.randomNormal([20, 20]);
 * const time = await tf.time(() => x.matMul(x));
 *
 * console.log(`kernelMs: ${time.kernelMs}, wallTimeMs: ${time.wallMs}`);
 * ```
 *
 * @param f The function to execute and time.
 *
 * @doc {heading: 'Performance', subheading: 'Timing'}
 */
export function time(f) {
    return ENGINE.time(f);
}
/**
 * Sets the backend (cpu, webgl, wasm, etc) responsible for creating tensors and
 * executing operations on those tensors. Returns a promise that resolves
 * to a boolean if the backend initialization was successful.
 *
 * Note this disposes the current backend, if any, as well as any tensors
 * associated with it. A new backend is initialized, even if it is of the
 * same type as the previous one.
 *
 * @param backendName The name of the backend. Currently supports
 *     `'webgl'|'cpu'` in the browser, `'tensorflow'` under node.js
 *     (requires tfjs-node), and `'wasm'` (requires tfjs-backend-wasm).
 *
 * @doc {heading: 'Backends'}
 */
export function setBackend(backendName) {
    return ENGINE.setBackend(backendName);
}
/**
 * Returns a promise that resolves when the currently selected backend (or the
 * highest priority one) has initialized. Await this promise when you are using
 * a backend that has async initialization.
 *
 * @doc {heading: 'Backends'}
 */
export function ready() {
    return ENGINE.ready();
}
/**
 * Returns the current backend name (cpu, webgl, etc). The backend is
 * responsible for creating tensors and executing operations on those tensors.
 *
 * @doc {heading: 'Backends'}
 */
export function getBackend() {
    return ENGINE.backendName;
}
/**
 * Removes a backend and the registered factory.
 *
 * @doc {heading: 'Backends'}
 */
export function removeBackend(name) {
    ENGINE.removeBackend(name);
}
/**
 * Finds the backend registered under the provided name. Returns null if the
 * name is not in the registry, or the registration hasn't finished yet.
 */
export function findBackend(name) {
    return ENGINE.findBackend(name);
}
/**
 * Finds the backend factory registered under the provided name. Returns a
 * function that produces a new backend when called. Returns null if the name
 * is not in the registry.
 */
export function findBackendFactory(name) {
    return ENGINE.findBackendFactory(name);
}
/**
 * Registers a global backend. The registration should happen when importing
 * a module file (e.g. when importing `backend_webgl.ts`), and is used for
 * modular builds (e.g. custom tfjs bundle with only webgl support).
 *
 * @param factory The backend factory function. When called, it should
 * return a backend instance, or a promise of an instance.
 * @param priority The priority of the backend (higher = more important).
 *     In case multiple backends are registered, the priority is used to find
 *     the best backend. Defaults to 1.
 * @return False if there is already a registered backend under this name, true
 *     if not.
 *
 * @doc {heading: 'Backends'}
 */
export function registerBackend(name, factory, priority = 1) {
    return ENGINE.registerBackend(name, factory, priority);
}
/**
 * Gets the current backend. If no backends have been initialized, this will
 * attempt to initialize the best backend. Will throw an error if the highest
 * priority backend has async initialization, in which case you should call
 * 'await tf.ready()' before running other code.
 *
 * @doc {heading: 'Backends'}
 */
export function backend() {
    return ENGINE.backend;
}
/**
 * Sets the global platform.
 *
 * @param platformName The name of this platform.
 * @param platform A platform implementation.
 */
export function setPlatform(platformName, platform) {
    env().setPlatform(platformName, platform);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvZ2xvYmFscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsTUFBTSxFQUF1RCxNQUFNLFVBQVUsQ0FBQztBQUN0RixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR2xDLE9BQU8sRUFBQyx1QkFBdUIsRUFBUyxNQUFNLFVBQVUsQ0FBQztBQUV6RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFcEQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsY0FBYztJQUM1QixHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFCLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsTUFBTSxVQUFVLGVBQWU7SUFDN0IsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQsNkNBQTZDO0FBQzdDLE1BQU0sVUFBVSwwQkFBMEI7SUFDeEMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pELE9BQU8sQ0FBQyxJQUFJLENBQUMsd0RBQXdELENBQUMsQ0FBQztBQUN6RSxDQUFDO0FBRUQsaURBQWlEO0FBQ2pELE1BQU0sVUFBVSxlQUFlLENBQUMsR0FBVztJQUN6QyxJQUFJLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxFQUFFO1FBQ2pELE9BQU8sQ0FBQyxJQUFJLENBQ1IsR0FBRyxHQUFHLDZDQUE2QztZQUNuRCxrQ0FBa0MsQ0FBQyxDQUFDO0tBQ3pDO0FBQ0gsQ0FBQztBQUNELHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRXpDOzs7O0dBSUc7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LEVBQUUsUUFBa0I7SUFDbEUsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbEJhY2tlbmR9IGZyb20gJy4vYmFja2VuZHMvYmFja2VuZCc7XG5pbXBvcnQge0VOR0lORSwgRW5naW5lLCBNZW1vcnlJbmZvLCBQcm9maWxlSW5mbywgU2NvcGVGbiwgVGltaW5nSW5mb30gZnJvbSAnLi9lbmdpbmUnO1xuaW1wb3J0IHtlbnZ9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuXG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICcuL3BsYXRmb3Jtcy9wbGF0Zm9ybSc7XG5pbXBvcnQge3NldERlcHJlY2F0aW9uV2FybmluZ0ZuLCBUZW5zb3J9IGZyb20gJy4vdGVuc29yJztcbmltcG9ydCB7VGVuc29yQ29udGFpbmVyfSBmcm9tICcuL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2dldFRlbnNvcnNJbkNvbnRhaW5lcn0gZnJvbSAnLi90ZW5zb3JfdXRpbCc7XG5cbi8qKlxuICogRW5hYmxlcyBwcm9kdWN0aW9uIG1vZGUgd2hpY2ggZGlzYWJsZXMgY29ycmVjdG5lc3MgY2hlY2tzIGluIGZhdm9yIG9mXG4gKiBwZXJmb3JtYW5jZS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnRW52aXJvbm1lbnQnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlUHJvZE1vZGUoKTogdm9pZCB7XG4gIGVudigpLnNldCgnUFJPRCcsIHRydWUpO1xufVxuXG4vKipcbiAqIEVuYWJsZXMgZGVidWcgbW9kZSB3aGljaCB3aWxsIGxvZyBpbmZvcm1hdGlvbiBhYm91dCBhbGwgZXhlY3V0ZWQga2VybmVsczpcbiAqIHRoZSBlbGFwc2VkIHRpbWUgb2YgdGhlIGtlcm5lbCBleGVjdXRpb24sIGFzIHdlbGwgYXMgdGhlIHJhbmssIHNoYXBlLCBhbmRcbiAqIHNpemUgb2YgdGhlIG91dHB1dCB0ZW5zb3IuXG4gKlxuICogRGVidWcgbW9kZSB3aWxsIHNpZ25pZmljYW50bHkgc2xvdyBkb3duIHlvdXIgYXBwbGljYXRpb24gYXMgaXQgd2lsbFxuICogZG93bmxvYWQgdGhlIHJlc3VsdCBvZiBldmVyeSBvcGVyYXRpb24gdG8gdGhlIENQVS4gVGhpcyBzaG91bGQgbm90IGJlIHVzZWQgaW5cbiAqIHByb2R1Y3Rpb24uIERlYnVnIG1vZGUgZG9lcyBub3QgYWZmZWN0IHRoZSB0aW1pbmcgaW5mb3JtYXRpb24gb2YgdGhlIGtlcm5lbFxuICogZXhlY3V0aW9uIGFzIHdlIGRvIG5vdCBtZWFzdXJlIGRvd25sb2FkIHRpbWUgaW4gdGhlIGtlcm5lbCBleGVjdXRpb24gdGltZS5cbiAqXG4gKiBTZWUgYWxzbzogYHRmLnByb2ZpbGVgLCBgdGYubWVtb3J5YC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnRW52aXJvbm1lbnQnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlRGVidWdNb2RlKCk6IHZvaWQge1xuICBlbnYoKS5zZXQoJ0RFQlVHJywgdHJ1ZSk7XG59XG5cbi8qKiBHbG9iYWxseSBkaXNhYmxlcyBkZXByZWNhdGlvbiB3YXJuaW5ncyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGVEZXByZWNhdGlvbldhcm5pbmdzKCk6IHZvaWQge1xuICBlbnYoKS5zZXQoJ0RFUFJFQ0FUSU9OX1dBUk5JTkdTX0VOQUJMRUQnLCBmYWxzZSk7XG4gIGNvbnNvbGUud2FybihgVGVuc29yRmxvdy5qcyBkZXByZWNhdGlvbiB3YXJuaW5ncyBoYXZlIGJlZW4gZGlzYWJsZWQuYCk7XG59XG5cbi8qKiBXYXJuIHVzZXJzIGFib3V0IGRlcHJlY2F0ZWQgZnVuY3Rpb25hbGl0eS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXByZWNhdGlvbldhcm4obXNnOiBzdHJpbmcpIHtcbiAgaWYgKGVudigpLmdldEJvb2woJ0RFUFJFQ0FUSU9OX1dBUk5JTkdTX0VOQUJMRUQnKSkge1xuICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgbXNnICsgJyBZb3UgY2FuIGRpc2FibGUgZGVwcmVjYXRpb24gd2FybmluZ3Mgd2l0aCAnICtcbiAgICAgICAgJ3RmLmRpc2FibGVEZXByZWNhdGlvbldhcm5pbmdzKCkuJyk7XG4gIH1cbn1cbnNldERlcHJlY2F0aW9uV2FybmluZ0ZuKGRlcHJlY2F0aW9uV2Fybik7XG5cbi8qKlxuICogRGlzcG9zZSBhbGwgdmFyaWFibGVzIGtlcHQgaW4gYmFja2VuZCBlbmdpbmUuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ0Vudmlyb25tZW50J31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3Bvc2VWYXJpYWJsZXMoKTogdm9pZCB7XG4gIEVOR0lORS5kaXNwb3NlVmFyaWFibGVzKCk7XG59XG5cbi8qKlxuICogSXQgcmV0dXJucyB0aGUgZ2xvYmFsIGVuZ2luZSB0aGF0IGtlZXBzIHRyYWNrIG9mIGFsbCB0ZW5zb3JzIGFuZCBiYWNrZW5kcy5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnRW52aXJvbm1lbnQnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5naW5lKCk6IEVuZ2luZSB7XG4gIHJldHVybiBFTkdJTkU7XG59XG5cbi8qKlxuICogUmV0dXJucyBtZW1vcnkgaW5mbyBhdCB0aGUgY3VycmVudCB0aW1lIGluIHRoZSBwcm9ncmFtLiBUaGUgcmVzdWx0IGlzIGFuXG4gKiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogLSBgbnVtQnl0ZXNgOiBOdW1iZXIgb2YgYnl0ZXMgYWxsb2NhdGVkICh1bmRpc3Bvc2VkKSBhdCB0aGlzIHRpbWUuXG4gKiAtIGBudW1UZW5zb3JzYDogTnVtYmVyIG9mIHVuaXF1ZSB0ZW5zb3JzIGFsbG9jYXRlZC5cbiAqIC0gYG51bURhdGFCdWZmZXJzYDogTnVtYmVyIG9mIHVuaXF1ZSBkYXRhIGJ1ZmZlcnMgYWxsb2NhdGVkXG4gKiAgICh1bmRpc3Bvc2VkKSBhdCB0aGlzIHRpbWUsIHdoaWNoIGlzIOKJpCB0aGUgbnVtYmVyIG9mIHRlbnNvcnNcbiAqICAgKGUuZy4gYGEucmVzaGFwZShuZXdTaGFwZSlgIG1ha2VzIGEgbmV3IFRlbnNvciB0aGF0IHNoYXJlcyB0aGUgc2FtZVxuICogICBkYXRhIGJ1ZmZlciB3aXRoIGBhYCkuXG4gKiAtIGB1bnJlbGlhYmxlYDogVHJ1ZSBpZiB0aGUgbWVtb3J5IHVzYWdlIGlzIHVucmVsaWFibGUuIFNlZSBgcmVhc29uc2Agd2hlblxuICogICAgYHVucmVsaWFibGVgIGlzIHRydWUuXG4gKiAtIGByZWFzb25zYDogYHN0cmluZ1tdYCwgcmVhc29ucyB3aHkgdGhlIG1lbW9yeSBpcyB1bnJlbGlhYmxlLCBwcmVzZW50IGlmXG4gKiAgICBgdW5yZWxpYWJsZWAgaXMgdHJ1ZS5cbiAqXG4gKiBXZWJHTCBQcm9wZXJ0aWVzOlxuICogLSBgbnVtQnl0ZXNJbkdQVWA6IE51bWJlciBvZiBieXRlcyBhbGxvY2F0ZWQgKHVuZGlzcG9zZWQpIGluIHRoZSBHUFUgb25seSBhdFxuICogICAgIHRoaXMgdGltZS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnUGVyZm9ybWFuY2UnLCBzdWJoZWFkaW5nOiAnTWVtb3J5J31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lbW9yeSgpOiBNZW1vcnlJbmZvIHtcbiAgcmV0dXJuIEVOR0lORS5tZW1vcnkoKTtcbn1cblxuLyoqXG4gKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gYGYoKWAgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXNcbiAqIHdpdGggaW5mb3JtYXRpb24gYWJvdXQgdGhlIGZ1bmN0aW9uJ3MgbWVtb3J5IHVzZTpcbiAqIC0gYG5ld0J5dGVzYDogdGhlIG51bWJlciBvZiBuZXcgYnl0ZXMgYWxsb2NhdGVkXG4gKiAtIGBuZXdUZW5zb3JzYDogdGhlIG51bWJlciBvZiBuZXcgdGVuc29ycyBjcmVhdGVkXG4gKiAtIGBwZWFrQnl0ZXNgOiB0aGUgcGVhayBudW1iZXIgb2YgYnl0ZXMgYWxsb2NhdGVkXG4gKiAtIGBrZXJuZWxzYDogYW4gYXJyYXkgb2Ygb2JqZWN0cyBmb3IgZWFjaCBrZXJuZWwgaW52b2x2ZWQgdGhhdCByZXBvcnRzXG4gKiB0aGVpciBpbnB1dCBhbmQgb3V0cHV0IHNoYXBlcywgbnVtYmVyIG9mIGJ5dGVzIHVzZWQsIGFuZCBudW1iZXIgb2YgbmV3XG4gKiB0ZW5zb3JzIGNyZWF0ZWQuXG4gKiAtIGBrZXJuZWxOYW1lc2A6IGFuIGFycmF5IG9mIHVuaXF1ZSBzdHJpbmdzIHdpdGgganVzdCB0aGUgbmFtZXMgb2YgdGhlXG4gKiBrZXJuZWxzIGluIHRoZSBga2VybmVsc2AgYXJyYXkuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCB0Zi5wcm9maWxlKCgpID0+IHtcbiAqICAgY29uc3QgeCA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzXSk7XG4gKiAgIGxldCB4MiA9IHguc3F1YXJlKCk7XG4gKiAgIHgyLmRpc3Bvc2UoKTtcbiAqICAgeDIgPSB4LnNxdWFyZSgpO1xuICogICB4Mi5kaXNwb3NlKCk7XG4gKiAgIHJldHVybiB4O1xuICogfSk7XG4gKlxuICogY29uc29sZS5sb2coYG5ld0J5dGVzOiAke3Byb2ZpbGUubmV3Qnl0ZXN9YCk7XG4gKiBjb25zb2xlLmxvZyhgbmV3VGVuc29yczogJHtwcm9maWxlLm5ld1RlbnNvcnN9YCk7XG4gKiBjb25zb2xlLmxvZyhgYnl0ZSB1c2FnZSBvdmVyIGFsbCBrZXJuZWxzOiAke3Byb2ZpbGUua2VybmVscy5tYXAoayA9PlxuICogay50b3RhbEJ5dGVzU25hcHNob3QpfWApO1xuICogYGBgXG4gKlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdQZXJmb3JtYW5jZScsIHN1YmhlYWRpbmc6ICdQcm9maWxlJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2ZpbGUoZjogKCkgPT4gKFRlbnNvckNvbnRhaW5lciB8IFByb21pc2U8VGVuc29yQ29udGFpbmVyPikpOlxuICAgIFByb21pc2U8UHJvZmlsZUluZm8+IHtcbiAgcmV0dXJuIEVOR0lORS5wcm9maWxlKGYpO1xufVxuXG4vKipcbiAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBgZm5gIGFuZCBhZnRlciBpdCBpcyBleGVjdXRlZCwgY2xlYW5zIHVwIGFsbFxuICogaW50ZXJtZWRpYXRlIHRlbnNvcnMgYWxsb2NhdGVkIGJ5IGBmbmAgZXhjZXB0IHRob3NlIHJldHVybmVkIGJ5IGBmbmAuXG4gKiBgZm5gIG11c3Qgbm90IHJldHVybiBhIFByb21pc2UgKGFzeW5jIGZ1bmN0aW9ucyBub3QgYWxsb3dlZCkuIFRoZSByZXR1cm5lZFxuICogcmVzdWx0IGNhbiBiZSBhIGNvbXBsZXggb2JqZWN0LlxuICpcbiAqIFVzaW5nIHRoaXMgbWV0aG9kIGhlbHBzIGF2b2lkIG1lbW9yeSBsZWFrcy4gSW4gZ2VuZXJhbCwgd3JhcCBjYWxscyB0b1xuICogb3BlcmF0aW9ucyBpbiBgdGYudGlkeWAgZm9yIGF1dG9tYXRpYyBtZW1vcnkgY2xlYW51cC5cbiAqXG4gKiBOT1RFOiBWYXJpYWJsZXMgZG8gKm5vdCogZ2V0IGNsZWFuZWQgdXAgd2hlbiBpbnNpZGUgYSB0aWR5KCkuIElmIHlvdSB3YW50IHRvXG4gKiBkaXNwb3NlIHZhcmlhYmxlcywgcGxlYXNlIHVzZSBgdGYuZGlzcG9zZVZhcmlhYmxlc2Agb3IgY2FsbCBkaXNwb3NlKClcbiAqIGRpcmVjdGx5IG9uIHZhcmlhYmxlcy5cbiAqXG4gKiBgYGBqc1xuICogLy8geSA9IDIgXiAyICsgMVxuICogY29uc3QgeSA9IHRmLnRpZHkoKCkgPT4ge1xuICogICAvLyBhLCBiLCBhbmQgb25lIHdpbGwgYmUgY2xlYW5lZCB1cCB3aGVuIHRoZSB0aWR5IGVuZHMuXG4gKiAgIGNvbnN0IG9uZSA9IHRmLnNjYWxhcigxKTtcbiAqICAgY29uc3QgYSA9IHRmLnNjYWxhcigyKTtcbiAqICAgY29uc3QgYiA9IGEuc3F1YXJlKCk7XG4gKlxuICogICBjb25zb2xlLmxvZygnbnVtVGVuc29ycyAoaW4gdGlkeSk6ICcgKyB0Zi5tZW1vcnkoKS5udW1UZW5zb3JzKTtcbiAqXG4gKiAgIC8vIFRoZSB2YWx1ZSByZXR1cm5lZCBpbnNpZGUgdGhlIHRpZHkgZnVuY3Rpb24gd2lsbCByZXR1cm5cbiAqICAgLy8gdGhyb3VnaCB0aGUgdGlkeSwgaW4gdGhpcyBjYXNlIHRvIHRoZSB2YXJpYWJsZSB5LlxuICogICByZXR1cm4gYi5hZGQob25lKTtcbiAqIH0pO1xuICpcbiAqIGNvbnNvbGUubG9nKCdudW1UZW5zb3JzIChvdXRzaWRlIHRpZHkpOiAnICsgdGYubWVtb3J5KCkubnVtVGVuc29ycyk7XG4gKiB5LnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gbmFtZU9yRm4gVGhlIG5hbWUgb2YgdGhlIGNsb3N1cmUsIG9yIHRoZSBmdW5jdGlvbiB0byBleGVjdXRlLlxuICogICAgIElmIGEgbmFtZSBpcyBwcm92aWRlZCwgdGhlIDJuZCBhcmd1bWVudCBzaG91bGQgYmUgdGhlIGZ1bmN0aW9uLlxuICogICAgIElmIGRlYnVnIG1vZGUgaXMgb24sIHRoZSB0aW1pbmcgYW5kIHRoZSBtZW1vcnkgdXNhZ2Ugb2YgdGhlIGZ1bmN0aW9uXG4gKiAgICAgd2lsbCBiZSB0cmFja2VkIGFuZCBkaXNwbGF5ZWQgb24gdGhlIGNvbnNvbGUgdXNpbmcgdGhlIHByb3ZpZGVkIG5hbWUuXG4gKiBAcGFyYW0gZm4gVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1BlcmZvcm1hbmNlJywgc3ViaGVhZGluZzogJ01lbW9yeSd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aWR5PFQgZXh0ZW5kcyBUZW5zb3JDb250YWluZXI+KFxuICAgIG5hbWVPckZuOiBzdHJpbmd8U2NvcGVGbjxUPiwgZm4/OiBTY29wZUZuPFQ+KTogVCB7XG4gIHJldHVybiBFTkdJTkUudGlkeShuYW1lT3JGbiwgZm4pO1xufVxuXG4vKipcbiAqIERpc3Bvc2VzIGFueSBgdGYuVGVuc29yYHMgZm91bmQgd2l0aGluIHRoZSBwcm92aWRlZCBvYmplY3QuXG4gKlxuICogQHBhcmFtIGNvbnRhaW5lciBhbiBvYmplY3QgdGhhdCBtYXkgYmUgYSBgdGYuVGVuc29yYCBvciBtYXkgZGlyZWN0bHlcbiAqICAgICBjb250YWluIGB0Zi5UZW5zb3Jgcywgc3VjaCBhcyBhIGBUZW5zb3JbXWAgb3IgYHtrZXk6IFRlbnNvciwgLi4ufWAuIElmXG4gKiAgICAgdGhlIG9iamVjdCBpcyBub3QgYSBgdGYuVGVuc29yYCBvciBkb2VzIG5vdCBjb250YWluIGBUZW5zb3JzYCwgbm90aGluZ1xuICogICAgIGhhcHBlbnMuIEluIGdlbmVyYWwgaXQgaXMgc2FmZSB0byBwYXNzIGFueSBvYmplY3QgaGVyZSwgZXhjZXB0IHRoYXRcbiAqICAgICBgUHJvbWlzZWBzIGFyZSBub3Qgc3VwcG9ydGVkLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdQZXJmb3JtYW5jZScsIHN1YmhlYWRpbmc6ICdNZW1vcnknfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzcG9zZShjb250YWluZXI6IFRlbnNvckNvbnRhaW5lcikge1xuICBjb25zdCB0ZW5zb3JzID0gZ2V0VGVuc29yc0luQ29udGFpbmVyKGNvbnRhaW5lcik7XG4gIHRlbnNvcnMuZm9yRWFjaCh0ZW5zb3IgPT4gdGVuc29yLmRpc3Bvc2UoKSk7XG59XG5cbi8qKlxuICogS2VlcHMgYSBgdGYuVGVuc29yYCBnZW5lcmF0ZWQgaW5zaWRlIGEgYHRmLnRpZHlgIGZyb20gYmVpbmcgZGlzcG9zZWRcbiAqIGF1dG9tYXRpY2FsbHkuXG4gKlxuICogYGBganNcbiAqIGxldCBiO1xuICogY29uc3QgeSA9IHRmLnRpZHkoKCkgPT4ge1xuICogICBjb25zdCBvbmUgPSB0Zi5zY2FsYXIoMSk7XG4gKiAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoMik7XG4gKlxuICogICAvLyBiIHdpbGwgbm90IGJlIGNsZWFuZWQgdXAgYnkgdGhlIHRpZHkuIGEgYW5kIG9uZSB3aWxsIGJlIGNsZWFuZWQgdXBcbiAqICAgLy8gd2hlbiB0aGUgdGlkeSBlbmRzLlxuICogICBiID0gdGYua2VlcChhLnNxdWFyZSgpKTtcbiAqXG4gKiAgIGNvbnNvbGUubG9nKCdudW1UZW5zb3JzIChpbiB0aWR5KTogJyArIHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpO1xuICpcbiAqICAgLy8gVGhlIHZhbHVlIHJldHVybmVkIGluc2lkZSB0aGUgdGlkeSBmdW5jdGlvbiB3aWxsIHJldHVyblxuICogICAvLyB0aHJvdWdoIHRoZSB0aWR5LCBpbiB0aGlzIGNhc2UgdG8gdGhlIHZhcmlhYmxlIHkuXG4gKiAgIHJldHVybiBiLmFkZChvbmUpO1xuICogfSk7XG4gKlxuICogY29uc29sZS5sb2coJ251bVRlbnNvcnMgKG91dHNpZGUgdGlkeSk6ICcgKyB0Zi5tZW1vcnkoKS5udW1UZW5zb3JzKTtcbiAqIGNvbnNvbGUubG9nKCd5OicpO1xuICogeS5wcmludCgpO1xuICogY29uc29sZS5sb2coJ2I6Jyk7XG4gKiBiLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gcmVzdWx0IFRoZSB0ZW5zb3IgdG8ga2VlcCBmcm9tIGJlaW5nIGRpc3Bvc2VkLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdQZXJmb3JtYW5jZScsIHN1YmhlYWRpbmc6ICdNZW1vcnknfVxuICovXG5leHBvcnQgZnVuY3Rpb24ga2VlcDxUIGV4dGVuZHMgVGVuc29yPihyZXN1bHQ6IFQpOiBUIHtcbiAgcmV0dXJuIEVOR0lORS5rZWVwKHJlc3VsdCk7XG59XG5cbi8qKlxuICogRXhlY3V0ZXMgYGYoKWAgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aW1pbmdcbiAqIGluZm9ybWF0aW9uLlxuICpcbiAqIFRoZSByZXN1bHQgaXMgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqIC0gYHdhbGxNc2A6IFdhbGwgZXhlY3V0aW9uIHRpbWUuXG4gKiAtIGBrZXJuZWxNc2A6IEtlcm5lbCBleGVjdXRpb24gdGltZSwgaWdub3JpbmcgZGF0YSB0cmFuc2Zlci4gSWYgdXNpbmcgdGhlXG4gKiBXZWJHTCBiYWNrZW5kIGFuZCB0aGUgcXVlcnkgdGltZXIgZXh0ZW5zaW9uIGlzIG5vdCBhdmFpbGFibGUsIHRoaXMgd2lsbFxuICogcmV0dXJuIGFuIGVycm9yIG9iamVjdC5cbiAqIC0gT24gYFdlYkdMYCBUaGUgZm9sbG93aW5nIGFkZGl0aW9uYWwgcHJvcGVydGllcyBleGlzdDpcbiAqICAgLSBgdXBsb2FkV2FpdE1zYDogQ1BVIGJsb2NraW5nIHRpbWUgb24gdGV4dHVyZSB1cGxvYWRzLlxuICogICAtIGBkb3dubG9hZFdhaXRNc2A6IENQVSBibG9ja2luZyB0aW1lIG9uIHRleHR1cmUgZG93bmxvYWRzIChyZWFkUGl4ZWxzKS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnJhbmRvbU5vcm1hbChbMjAsIDIwXSk7XG4gKiBjb25zdCB0aW1lID0gYXdhaXQgdGYudGltZSgoKSA9PiB4Lm1hdE11bCh4KSk7XG4gKlxuICogY29uc29sZS5sb2coYGtlcm5lbE1zOiAke3RpbWUua2VybmVsTXN9LCB3YWxsVGltZU1zOiAke3RpbWUud2FsbE1zfWApO1xuICogYGBgXG4gKlxuICogQHBhcmFtIGYgVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYW5kIHRpbWUuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1BlcmZvcm1hbmNlJywgc3ViaGVhZGluZzogJ1RpbWluZyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lKGY6ICgpID0+IHZvaWQpOiBQcm9taXNlPFRpbWluZ0luZm8+IHtcbiAgcmV0dXJuIEVOR0lORS50aW1lKGYpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGJhY2tlbmQgKGNwdSwgd2ViZ2wsIHdhc20sIGV0YykgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRlbnNvcnMgYW5kXG4gKiBleGVjdXRpbmcgb3BlcmF0aW9ucyBvbiB0aG9zZSB0ZW5zb3JzLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzXG4gKiB0byBhIGJvb2xlYW4gaWYgdGhlIGJhY2tlbmQgaW5pdGlhbGl6YXRpb24gd2FzIHN1Y2Nlc3NmdWwuXG4gKlxuICogTm90ZSB0aGlzIGRpc3Bvc2VzIHRoZSBjdXJyZW50IGJhY2tlbmQsIGlmIGFueSwgYXMgd2VsbCBhcyBhbnkgdGVuc29yc1xuICogYXNzb2NpYXRlZCB3aXRoIGl0LiBBIG5ldyBiYWNrZW5kIGlzIGluaXRpYWxpemVkLCBldmVuIGlmIGl0IGlzIG9mIHRoZVxuICogc2FtZSB0eXBlIGFzIHRoZSBwcmV2aW91cyBvbmUuXG4gKlxuICogQHBhcmFtIGJhY2tlbmROYW1lIFRoZSBuYW1lIG9mIHRoZSBiYWNrZW5kLiBDdXJyZW50bHkgc3VwcG9ydHNcbiAqICAgICBgJ3dlYmdsJ3wnY3B1J2AgaW4gdGhlIGJyb3dzZXIsIGAndGVuc29yZmxvdydgIHVuZGVyIG5vZGUuanNcbiAqICAgICAocmVxdWlyZXMgdGZqcy1ub2RlKSwgYW5kIGAnd2FzbSdgIChyZXF1aXJlcyB0ZmpzLWJhY2tlbmQtd2FzbSkuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ0JhY2tlbmRzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEJhY2tlbmQoYmFja2VuZE5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gRU5HSU5FLnNldEJhY2tlbmQoYmFja2VuZE5hbWUpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGJhY2tlbmQgKG9yIHRoZVxuICogaGlnaGVzdCBwcmlvcml0eSBvbmUpIGhhcyBpbml0aWFsaXplZC4gQXdhaXQgdGhpcyBwcm9taXNlIHdoZW4geW91IGFyZSB1c2luZ1xuICogYSBiYWNrZW5kIHRoYXQgaGFzIGFzeW5jIGluaXRpYWxpemF0aW9uLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdCYWNrZW5kcyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkeSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIEVOR0lORS5yZWFkeSgpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGN1cnJlbnQgYmFja2VuZCBuYW1lIChjcHUsIHdlYmdsLCBldGMpLiBUaGUgYmFja2VuZCBpc1xuICogcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRlbnNvcnMgYW5kIGV4ZWN1dGluZyBvcGVyYXRpb25zIG9uIHRob3NlIHRlbnNvcnMuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ0JhY2tlbmRzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEJhY2tlbmQoKTogc3RyaW5nIHtcbiAgcmV0dXJuIEVOR0lORS5iYWNrZW5kTmFtZTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGEgYmFja2VuZCBhbmQgdGhlIHJlZ2lzdGVyZWQgZmFjdG9yeS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnQmFja2VuZHMnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlQmFja2VuZChuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgRU5HSU5FLnJlbW92ZUJhY2tlbmQobmFtZSk7XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGJhY2tlbmQgcmVnaXN0ZXJlZCB1bmRlciB0aGUgcHJvdmlkZWQgbmFtZS4gUmV0dXJucyBudWxsIGlmIHRoZVxuICogbmFtZSBpcyBub3QgaW4gdGhlIHJlZ2lzdHJ5LCBvciB0aGUgcmVnaXN0cmF0aW9uIGhhc24ndCBmaW5pc2hlZCB5ZXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQmFja2VuZChuYW1lOiBzdHJpbmcpOiBLZXJuZWxCYWNrZW5kIHtcbiAgcmV0dXJuIEVOR0lORS5maW5kQmFja2VuZChuYW1lKTtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgYmFja2VuZCBmYWN0b3J5IHJlZ2lzdGVyZWQgdW5kZXIgdGhlIHByb3ZpZGVkIG5hbWUuIFJldHVybnMgYVxuICogZnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhIG5ldyBiYWNrZW5kIHdoZW4gY2FsbGVkLiBSZXR1cm5zIG51bGwgaWYgdGhlIG5hbWVcbiAqIGlzIG5vdCBpbiB0aGUgcmVnaXN0cnkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQmFja2VuZEZhY3RvcnkobmFtZTogc3RyaW5nKTogKCkgPT5cbiAgICBLZXJuZWxCYWNrZW5kIHwgUHJvbWlzZTxLZXJuZWxCYWNrZW5kPiB7XG4gIHJldHVybiBFTkdJTkUuZmluZEJhY2tlbmRGYWN0b3J5KG5hbWUpO1xufVxuXG4vKipcbiAqIFJlZ2lzdGVycyBhIGdsb2JhbCBiYWNrZW5kLiBUaGUgcmVnaXN0cmF0aW9uIHNob3VsZCBoYXBwZW4gd2hlbiBpbXBvcnRpbmdcbiAqIGEgbW9kdWxlIGZpbGUgKGUuZy4gd2hlbiBpbXBvcnRpbmcgYGJhY2tlbmRfd2ViZ2wudHNgKSwgYW5kIGlzIHVzZWQgZm9yXG4gKiBtb2R1bGFyIGJ1aWxkcyAoZS5nLiBjdXN0b20gdGZqcyBidW5kbGUgd2l0aCBvbmx5IHdlYmdsIHN1cHBvcnQpLlxuICpcbiAqIEBwYXJhbSBmYWN0b3J5IFRoZSBiYWNrZW5kIGZhY3RvcnkgZnVuY3Rpb24uIFdoZW4gY2FsbGVkLCBpdCBzaG91bGRcbiAqIHJldHVybiBhIGJhY2tlbmQgaW5zdGFuY2UsIG9yIGEgcHJvbWlzZSBvZiBhbiBpbnN0YW5jZS5cbiAqIEBwYXJhbSBwcmlvcml0eSBUaGUgcHJpb3JpdHkgb2YgdGhlIGJhY2tlbmQgKGhpZ2hlciA9IG1vcmUgaW1wb3J0YW50KS5cbiAqICAgICBJbiBjYXNlIG11bHRpcGxlIGJhY2tlbmRzIGFyZSByZWdpc3RlcmVkLCB0aGUgcHJpb3JpdHkgaXMgdXNlZCB0byBmaW5kXG4gKiAgICAgdGhlIGJlc3QgYmFja2VuZC4gRGVmYXVsdHMgdG8gMS5cbiAqIEByZXR1cm4gRmFsc2UgaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHJlZ2lzdGVyZWQgYmFja2VuZCB1bmRlciB0aGlzIG5hbWUsIHRydWVcbiAqICAgICBpZiBub3QuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ0JhY2tlbmRzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQmFja2VuZChcbiAgICBuYW1lOiBzdHJpbmcsIGZhY3Rvcnk6ICgpID0+IEtlcm5lbEJhY2tlbmQgfCBQcm9taXNlPEtlcm5lbEJhY2tlbmQ+LFxuICAgIHByaW9yaXR5ID0gMSk6IGJvb2xlYW4ge1xuICByZXR1cm4gRU5HSU5FLnJlZ2lzdGVyQmFja2VuZChuYW1lLCBmYWN0b3J5LCBwcmlvcml0eSk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgY3VycmVudCBiYWNrZW5kLiBJZiBubyBiYWNrZW5kcyBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQsIHRoaXMgd2lsbFxuICogYXR0ZW1wdCB0byBpbml0aWFsaXplIHRoZSBiZXN0IGJhY2tlbmQuIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIGhpZ2hlc3RcbiAqIHByaW9yaXR5IGJhY2tlbmQgaGFzIGFzeW5jIGluaXRpYWxpemF0aW9uLCBpbiB3aGljaCBjYXNlIHlvdSBzaG91bGQgY2FsbFxuICogJ2F3YWl0IHRmLnJlYWR5KCknIGJlZm9yZSBydW5uaW5nIG90aGVyIGNvZGUuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ0JhY2tlbmRzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJhY2tlbmQoKTogS2VybmVsQmFja2VuZCB7XG4gIHJldHVybiBFTkdJTkUuYmFja2VuZDtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBnbG9iYWwgcGxhdGZvcm0uXG4gKlxuICogQHBhcmFtIHBsYXRmb3JtTmFtZSBUaGUgbmFtZSBvZiB0aGlzIHBsYXRmb3JtLlxuICogQHBhcmFtIHBsYXRmb3JtIEEgcGxhdGZvcm0gaW1wbGVtZW50YXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRQbGF0Zm9ybShwbGF0Zm9ybU5hbWU6IHN0cmluZywgcGxhdGZvcm06IFBsYXRmb3JtKSB7XG4gIGVudigpLnNldFBsYXRmb3JtKHBsYXRmb3JtTmFtZSwgcGxhdGZvcm0pO1xufVxuIl19