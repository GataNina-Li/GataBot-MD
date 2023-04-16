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
/**
 * Merges real and imaginary Float32Arrays into a single complex Float32Array.
 *
 * The memory layout is interleaved as follows:
 * real: [r0, r1, r2]
 * imag: [i0, i1, i2]
 * complex: [r0, i0, r1, i1, r2, i2]
 *
 * This is the inverse of splitRealAndImagArrays.
 *
 * @param real The real values of the complex tensor values.
 * @param imag The imag values of the complex tensor values.
 * @returns A complex tensor as a Float32Array with merged values.
 */
export function mergeRealAndImagArrays(real, imag) {
    if (real.length !== imag.length) {
        throw new Error(`Cannot merge real and imag arrays of different lengths. real:` +
            `${real.length}, imag: ${imag.length}.`);
    }
    const result = new Float32Array(real.length * 2);
    for (let i = 0; i < result.length; i += 2) {
        result[i] = real[i / 2];
        result[i + 1] = imag[i / 2];
    }
    return result;
}
/**
 * Splits a complex Float32Array into real and imag parts.
 *
 * The memory layout is interleaved as follows:
 * complex: [r0, i0, r1, i1, r2, i2]
 * real: [r0, r1, r2]
 * imag: [i0, i1, i2]
 *
 * This is the inverse of mergeRealAndImagArrays.
 *
 * @param complex The complex tensor values.
 * @returns An object with real and imag Float32Array components of the complex
 *     tensor.
 */
export function splitRealAndImagArrays(complex) {
    const real = new Float32Array(complex.length / 2);
    const imag = new Float32Array(complex.length / 2);
    for (let i = 0; i < complex.length; i += 2) {
        real[i / 2] = complex[i];
        imag[i / 2] = complex[i + 1];
    }
    return { real, imag };
}
/**
 * Extracts even indexed complex values in the given array.
 * @param complex The complex tensor values
 */
export function complexWithEvenIndex(complex) {
    const len = Math.ceil(complex.length / 4);
    const real = new Float32Array(len);
    const imag = new Float32Array(len);
    for (let i = 0; i < complex.length; i += 4) {
        real[Math.floor(i / 4)] = complex[i];
        imag[Math.floor(i / 4)] = complex[i + 1];
    }
    return { real, imag };
}
/**
 * Extracts odd indexed comple values in the given array.
 * @param complex The complex tensor values
 */
export function complexWithOddIndex(complex) {
    const len = Math.floor(complex.length / 4);
    const real = new Float32Array(len);
    const imag = new Float32Array(len);
    for (let i = 2; i < complex.length; i += 4) {
        real[Math.floor(i / 4)] = complex[i];
        imag[Math.floor(i / 4)] = complex[i + 1];
    }
    return { real, imag };
}
/**
 * Get the map representing a complex value in the given array.
 * @param complex The complex tensor values.
 * @param index An index of the target complex value.
 */
export function getComplexWithIndex(complex, index) {
    const real = complex[index * 2];
    const imag = complex[index * 2 + 1];
    return { real, imag };
}
/**
 * Insert a given complex value into the TypedArray.
 * @param data The array in which the complex value is inserted.
 * @param c The complex value to be inserted.
 * @param index An index of the target complex value.
 */
export function assignToTypedArray(data, real, imag, index) {
    data[index * 2] = real;
    data[index * 2 + 1] = imag;
}
/**
 * Make the list of exponent terms used by FFT.
 */
export function exponents(n, inverse) {
    const real = new Float32Array(n / 2);
    const imag = new Float32Array(n / 2);
    for (let i = 0; i < Math.ceil(n / 2); i++) {
        const x = (inverse ? 2 : -2) * Math.PI * (i / n);
        real[i] = Math.cos(x);
        imag[i] = Math.sin(x);
    }
    return { real, imag };
}
/**
 * Make the exponent term used by FFT.
 */
export function exponent(k, n, inverse) {
    const x = (inverse ? 2 : -2) * Math.PI * (k / n);
    const real = Math.cos(x);
    const imag = Math.sin(x);
    return { real, imag };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxleF91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9iYWNrZW5kcy9jb21wbGV4X3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0g7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILE1BQU0sVUFBVSxzQkFBc0IsQ0FDbEMsSUFBa0IsRUFBRSxJQUFrQjtJQUN4QyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUMvQixNQUFNLElBQUksS0FBSyxDQUNYLCtEQUErRDtZQUMvRCxHQUFHLElBQUksQ0FBQyxNQUFNLFdBQVcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDOUM7SUFDRCxNQUFNLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2pELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDekMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQzdCO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFNLFVBQVUsc0JBQXNCLENBQUMsT0FBcUI7SUFFMUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNsRCxNQUFNLElBQUksR0FBRyxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFB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LENBQUMsQ0FBQyxDQUFDO0lBQ3pCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsT0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQztBQUN0QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1R5cGVkQXJyYXl9IGZyb20gJy4uL3R5cGVzJztcbi8qKlxuICogTWVyZ2VzIHJlYWwgYW5kIGltYWdpbmFyeSBGbG9hdDMyQXJyYXlzIGludG8gYSBzaW5nbGUgY29tcGxleCBGbG9hdDMyQXJyYXkuXG4gKlxuICogVGhlIG1lbW9yeSBsYXlvdXQgaXMgaW50ZXJsZWF2ZWQgYXMgZm9sbG93czpcbiAqIHJlYWw6IFtyMCwgcjEsIHIyXVxuICogaW1hZzogW2kwLCBpMSwgaTJdXG4gKiBjb21wbGV4OiBbcjAsIGkwLCByMSwgaTEsIHIyLCBpMl1cbiAqXG4gKiBUaGlzIGlzIHRoZSBpbnZlcnNlIG9mIHNwbGl0UmVhbEFuZEltYWdBcnJheXMuXG4gKlxuICogQHBhcmFtIHJlYWwgVGhlIHJlYWwgdmFsdWVzIG9mIHRoZSBjb21wbGV4IHRlbnNvciB2YWx1ZXMuXG4gKiBAcGFyYW0gaW1hZyBUaGUgaW1hZyB2YWx1ZXMgb2YgdGhlIGNvbXBsZXggdGVuc29yIHZhbHVlcy5cbiAqIEByZXR1cm5zIEEgY29tcGxleCB0ZW5zb3IgYXMgYSBGbG9hdDMyQXJyYXkgd2l0aCBtZXJnZWQgdmFsdWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VSZWFsQW5kSW1hZ0FycmF5cyhcbiAgICByZWFsOiBGbG9hdDMyQXJyYXksIGltYWc6IEZsb2F0MzJBcnJheSk6IEZsb2F0MzJBcnJheSB7XG4gIGlmIChyZWFsLmxlbmd0aCAhPT0gaW1hZy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBDYW5ub3QgbWVyZ2UgcmVhbCBhbmQgaW1hZyBhcnJheXMgb2YgZGlmZmVyZW50IGxlbmd0aHMuIHJlYWw6YCArXG4gICAgICAgIGAke3JlYWwubGVuZ3RofSwgaW1hZzogJHtpbWFnLmxlbmd0aH0uYCk7XG4gIH1cbiAgY29uc3QgcmVzdWx0ID0gbmV3IEZsb2F0MzJBcnJheShyZWFsLmxlbmd0aCAqIDIpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlc3VsdFtpXSA9IHJlYWxbaSAvIDJdO1xuICAgIHJlc3VsdFtpICsgMV0gPSBpbWFnW2kgLyAyXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFNwbGl0cyBhIGNvbXBsZXggRmxvYXQzMkFycmF5IGludG8gcmVhbCBhbmQgaW1hZyBwYXJ0cy5cbiAqXG4gKiBUaGUgbWVtb3J5IGxheW91dCBpcyBpbnRlcmxlYXZlZCBhcyBmb2xsb3dzOlxuICogY29tcGxleDogW3IwLCBpMCwgcjEsIGkxLCByMiwgaTJdXG4gKiByZWFsOiBbcjAsIHIxLCByMl1cbiAqIGltYWc6IFtpMCwgaTEsIGkyXVxuICpcbiAqIFRoaXMgaXMgdGhlIGludmVyc2Ugb2YgbWVyZ2VSZWFsQW5kSW1hZ0FycmF5cy5cbiAqXG4gKiBAcGFyYW0gY29tcGxleCBUaGUgY29tcGxleCB0ZW5zb3IgdmFsdWVzLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggcmVhbCBhbmQgaW1hZyBGbG9hdDMyQXJyYXkgY29tcG9uZW50cyBvZiB0aGUgY29tcGxleFxuICogICAgIHRlbnNvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0UmVhbEFuZEltYWdBcnJheXMoY29tcGxleDogRmxvYXQzMkFycmF5KTpcbiAgICB7cmVhbDogRmxvYXQzMkFycmF5LCBpbWFnOiBGbG9hdDMyQXJyYXl9IHtcbiAgY29uc3QgcmVhbCA9IG5ldyBGbG9hdDMyQXJyYXkoY29tcGxleC5sZW5ndGggLyAyKTtcbiAgY29uc3QgaW1hZyA9IG5ldyBGbG9hdDMyQXJyYXkoY29tcGxleC5sZW5ndGggLyAyKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21wbGV4Lmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVhbFtpIC8gMl0gPSBjb21wbGV4W2ldO1xuICAgIGltYWdbaSAvIDJdID0gY29tcGxleFtpICsgMV07XG4gIH1cbiAgcmV0dXJuIHtyZWFsLCBpbWFnfTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0cyBldmVuIGluZGV4ZWQgY29tcGxleCB2YWx1ZXMgaW4gdGhlIGdpdmVuIGFycmF5LlxuICogQHBhcmFtIGNvbXBsZXggVGhlIGNvbXBsZXggdGVuc29yIHZhbHVlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGxleFdpdGhFdmVuSW5kZXgoY29tcGxleDogRmxvYXQzMkFycmF5KTpcbiAgICB7cmVhbDogRmxvYXQzMkFycmF5LCBpbWFnOiBGbG9hdDMyQXJyYXl9IHtcbiAgY29uc3QgbGVuID0gTWF0aC5jZWlsKGNvbXBsZXgubGVuZ3RoIC8gNCk7XG4gIGNvbnN0IHJlYWwgPSBuZXcgRmxvYXQzMkFycmF5KGxlbik7XG4gIGNvbnN0IGltYWcgPSBuZXcgRmxvYXQzMkFycmF5KGxlbik7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29tcGxleC5sZW5ndGg7IGkgKz0gNCkge1xuICAgIHJlYWxbTWF0aC5mbG9vcihpIC8gNCldID0gY29tcGxleFtpXTtcbiAgICBpbWFnW01hdGguZmxvb3IoaSAvIDQpXSA9IGNvbXBsZXhbaSArIDFdO1xuICB9XG4gIHJldHVybiB7cmVhbCwgaW1hZ307XG59XG5cbi8qKlxuICogRXh0cmFjdHMgb2RkIGluZGV4ZWQgY29tcGxlIHZhbHVlcyBpbiB0aGUgZ2l2ZW4gYXJyYXkuXG4gKiBAcGFyYW0gY29tcGxleCBUaGUgY29tcGxleCB0ZW5zb3IgdmFsdWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wbGV4V2l0aE9kZEluZGV4KGNvbXBsZXg6IEZsb2F0MzJBcnJheSk6XG4gICAge3JlYWw6IEZsb2F0MzJBcnJheSwgaW1hZzogRmxvYXQzMkFycmF5fSB7XG4gIGNvbnN0IGxlbiA9IE1hdGguZmxvb3IoY29tcGxleC5sZW5ndGggLyA0KTtcbiAgY29uc3QgcmVhbCA9IG5ldyBGbG9hdDMyQXJyYXkobGVuKTtcbiAgY29uc3QgaW1hZyA9IG5ldyBGbG9hdDMyQXJyYXkobGVuKTtcbiAgZm9yIChsZXQgaSA9IDI7IGkgPCBjb21wbGV4Lmxlbmd0aDsgaSArPSA0KSB7XG4gICAgcmVhbFtNYXRoLmZsb29yKGkgLyA0KV0gPSBjb21wbGV4W2ldO1xuICAgIGltYWdbTWF0aC5mbG9vcihpIC8gNCldID0gY29tcGxleFtpICsgMV07XG4gIH1cbiAgcmV0dXJuIHtyZWFsLCBpbWFnfTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIG1hcCByZXByZXNlbnRpbmcgYSBjb21wbGV4IHZhbHVlIGluIHRoZSBnaXZlbiBhcnJheS5cbiAqIEBwYXJhbSBjb21wbGV4IFRoZSBjb21wbGV4IHRlbnNvciB2YWx1ZXMuXG4gKiBAcGFyYW0gaW5kZXggQW4gaW5kZXggb2YgdGhlIHRhcmdldCBjb21wbGV4IHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tcGxleFdpdGhJbmRleChcbiAgICBjb21wbGV4OiBGbG9hdDMyQXJyYXksIGluZGV4OiBudW1iZXIpOiB7cmVhbDogbnVtYmVyLCBpbWFnOiBudW1iZXJ9IHtcbiAgY29uc3QgcmVhbCA9IGNvbXBsZXhbaW5kZXggKiAyXTtcbiAgY29uc3QgaW1hZyA9IGNvbXBsZXhbaW5kZXggKiAyICsgMV07XG4gIHJldHVybiB7cmVhbCwgaW1hZ307XG59XG5cbi8qKlxuICogSW5zZXJ0IGEgZ2l2ZW4gY29tcGxleCB2YWx1ZSBpbnRvIHRoZSBUeXBlZEFycmF5LlxuICogQHBhcmFtIGRhdGEgVGhlIGFycmF5IGluIHdoaWNoIHRoZSBjb21wbGV4IHZhbHVlIGlzIGluc2VydGVkLlxuICogQHBhcmFtIGMgVGhlIGNvbXBsZXggdmFsdWUgdG8gYmUgaW5zZXJ0ZWQuXG4gKiBAcGFyYW0gaW5kZXggQW4gaW5kZXggb2YgdGhlIHRhcmdldCBjb21wbGV4IHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzaWduVG9UeXBlZEFycmF5KFxuICAgIGRhdGE6IFR5cGVkQXJyYXksIHJlYWw6IG51bWJlciwgaW1hZzogbnVtYmVyLCBpbmRleDogbnVtYmVyKSB7XG4gIGRhdGFbaW5kZXggKiAyXSA9IHJlYWw7XG4gIGRhdGFbaW5kZXggKiAyICsgMV0gPSBpbWFnO1xufVxuXG4vKipcbiAqIE1ha2UgdGhlIGxpc3Qgb2YgZXhwb25lbnQgdGVybXMgdXNlZCBieSBGRlQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHBvbmVudHMoXG4gICAgbjogbnVtYmVyLCBpbnZlcnNlOiBib29sZWFuKToge3JlYWw6IEZsb2F0MzJBcnJheSwgaW1hZzogRmxvYXQzMkFycmF5fSB7XG4gIGNvbnN0IHJlYWwgPSBuZXcgRmxvYXQzMkFycmF5KG4gLyAyKTtcbiAgY29uc3QgaW1hZyA9IG5ldyBGbG9hdDMyQXJyYXkobiAvIDIpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGguY2VpbChuIC8gMik7IGkrKykge1xuICAgIGNvbnN0IHggPSAoaW52ZXJzZSA/IDIgOiAtMikgKiBNYXRoLlBJICogKGkgLyBuKTtcbiAgICByZWFsW2ldID0gTWF0aC5jb3MoeCk7XG4gICAgaW1hZ1tpXSA9IE1hdGguc2luKHgpO1xuICB9XG4gIHJldHVybiB7cmVhbCwgaW1hZ307XG59XG5cbi8qKlxuICogTWFrZSB0aGUgZXhwb25lbnQgdGVybSB1c2VkIGJ5IEZGVC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cG9uZW50KFxuICAgIGs6IG51bWJlciwgbjogbnVtYmVyLCBpbnZlcnNlOiBib29sZWFuKToge3JlYWw6IG51bWJlciwgaW1hZzogbnVtYmVyfSB7XG4gIGNvbnN0IHggPSAoaW52ZXJzZSA/IDIgOiAtMikgKiBNYXRoLlBJICogKGsgLyBuKTtcbiAgY29uc3QgcmVhbCA9IE1hdGguY29zKHgpO1xuICBjb25zdCBpbWFnID0gTWF0aC5zaW4oeCk7XG4gIHJldHVybiB7cmVhbCwgaW1hZ307XG59XG4iXX0=