/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/**
 * Testing utilities.
 */
import { memory, Tensor, test_util, util } from '@tensorflow/tfjs-core';
// tslint:disable-next-line: no-imports-from-dist
import { ALL_ENVS, describeWithFlags } from '@tensorflow/tfjs-core/dist/jasmine_util';
import { ValueError } from '../errors';
/**
 * Expect values are close between a Tensor or number array.
 * @param actual
 * @param expected
 */
export function expectTensorsClose(actual, expected, epsilon) {
    if (actual == null) {
        throw new ValueError('First argument to expectTensorsClose() is not defined.');
    }
    if (expected == null) {
        throw new ValueError('Second argument to expectTensorsClose() is not defined.');
    }
    if (actual instanceof Tensor && expected instanceof Tensor) {
        if (actual.dtype !== expected.dtype) {
            throw new Error(`Data types do not match. Actual: '${actual.dtype}'. ` +
                `Expected: '${expected.dtype}'`);
        }
        if (!util.arraysEqual(actual.shape, expected.shape)) {
            throw new Error(`Shapes do not match. Actual: [${actual.shape}]. ` +
                `Expected: [${expected.shape}].`);
        }
    }
    const actualData = actual instanceof Tensor ? actual.dataSync() : actual;
    const expectedData = expected instanceof Tensor ? expected.dataSync() : expected;
    test_util.expectArraysClose(actualData, expectedData, epsilon);
}
/**
 * Expect values in array are within a specified range, boundaries inclusive.
 * @param actual
 * @param expected
 */
export function expectTensorsValuesInRange(actual, low, high) {
    if (actual == null) {
        throw new ValueError('First argument to expectTensorsClose() is not defined.');
    }
    test_util.expectValuesInRange(actual.dataSync(), low, high);
}
/**
 * Describe tests to be run on CPU and GPU.
 * @param testName
 * @param tests
 */
export function describeMathCPUAndGPU(testName, tests) {
    describeWithFlags(testName, ALL_ENVS, () => {
        tests();
    });
}
/**
 * Describe tests to be run on CPU and GPU WebGL2.
 * @param testName
 * @param tests
 */
export function describeMathCPUAndWebGL2(testName, tests) {
    describeWithFlags(testName, {
        predicate: testEnv => (testEnv.flags == null || testEnv.flags['WEBGL_VERSION'] === 2)
    }, () => {
        tests();
    });
}
/**
 * Describe tests to be run on CPU only.
 * @param testName
 * @param tests
 */
export function describeMathCPU(testName, tests) {
    describeWithFlags(testName, { predicate: testEnv => testEnv.backendName === 'cpu' }, () => {
        tests();
    });
}
/**
 * Describe tests to be run on GPU only.
 * @param testName
 * @param tests
 */
export function describeMathGPU(testName, tests) {
    describeWithFlags(testName, { predicate: testEnv => testEnv.backendName === 'webgl' }, () => {
        tests();
    });
}
/**
 * Describe tests to be run on WebGL2 GPU only.
 * @param testName
 * @param tests
 */
export function describeMathWebGL2(testName, tests) {
    describeWithFlags(testName, {
        predicate: testEnv => testEnv.backendName === 'webgl' &&
            (testEnv.flags == null || testEnv.flags['WEBGL_VERSION'] === 2)
    }, () => {
        tests();
    });
}
/**
 * Check that a function only generates the expected number of new Tensors.
 *
 * The test  function is called twice, once to prime any regular constants and
 * once to ensure that additional copies aren't created/tensors aren't leaked.
 *
 * @param testFunc A fully curried (zero arg) version of the function to test.
 * @param numNewTensors The expected number of new Tensors that should exist.
 */
export function expectNoLeakedTensors(
// tslint:disable-next-line:no-any
testFunc, numNewTensors) {
    testFunc();
    const numTensorsBefore = memory().numTensors;
    testFunc();
    const numTensorsAfter = memory().numTensors;
    const actualNewTensors = numTensorsAfter - numTensorsBefore;
    if (actualNewTensors !== numNewTensors) {
        throw new ValueError(`Created an unexpected number of new ` +
            `Tensors.  Expected: ${numNewTensors}, created : ${actualNewTensors}. ` +
            `Please investigate the discrepency and/or use tidy.`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtbGF5ZXJzL3NyYy91dGlscy90ZXN0X3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUg7O0dBRUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDdEUsaURBQWlEO0FBQ2pELE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSx5Q0FBeUMsQ0FBQztBQUVwRixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRXJDOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQzlCLE1BQXVCLEVBQUUsUUFBeUIsRUFBRSxPQUFnQjtJQUN0RSxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7UUFDbEIsTUFBTSxJQUFJLFVBQVUsQ0FDaEIsd0RBQXdELENBQUMsQ0FBQztLQUMvRDtJQUNELElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtRQUNwQixNQUFNLElBQUksVUFBVSxDQUNoQix5REFBeUQsQ0FBQyxDQUFDO0tBQ2hFO0lBQ0QsSUFBSSxNQUFNLFlBQVksTUFBTSxJQUFJLFFBQVEsWUFBWSxNQUFNLEVBQUU7UUFDMUQsSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FDWCxxQ0FBcUMsTUFBTSxDQUFDLEtBQUssS0FBSztnQkFDdEQsY0FBYyxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUN0QztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ25ELE1BQU0sSUFBSSxLQUFLLENBQ1gsaUNBQWlDLE1B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QXFCO0lBQzVDLFFBQVEsRUFBRSxDQUFDO0lBQ1gsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDN0MsUUFBUSxFQUFFLENBQUM7SUFDWCxNQUFNLGVBQWUsR0FBRyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDNUMsTUFBTSxnQkFBZ0IsR0FBRyxlQUFlLEdBQUcsZ0JBQWdCLENBQUM7SUFDNUQsSUFBSSxnQkFBZ0IsS0FBSyxhQUFhLEVBQUU7UUFDdEMsTUFBTSxJQUFJLFVBQVUsQ0FDaEIsc0NBQXNDO1lBQ3RDLHVCQUF1QixhQUFhLGVBQ2hDLGdCQUFnQixJQUFJO1lBQ3hCLHFEQUFxRCxDQUFDLENBQUM7S0FDNUQ7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyoqXG4gKiBUZXN0aW5nIHV0aWxpdGllcy5cbiAqL1xuXG5pbXBvcnQge21lbW9yeSwgVGVuc29yLCB0ZXN0X3V0aWwsIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLWltcG9ydHMtZnJvbS1kaXN0XG5pbXBvcnQge0FMTF9FTlZTLCBkZXNjcmliZVdpdGhGbGFnc30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlL2Rpc3QvamFzbWluZV91dGlsJztcblxuaW1wb3J0IHtWYWx1ZUVycm9yfSBmcm9tICcuLi9lcnJvcnMnO1xuXG4vKipcbiAqIEV4cGVjdCB2YWx1ZXMgYXJlIGNsb3NlIGJldHdlZW4gYSBUZW5zb3Igb3IgbnVtYmVyIGFycmF5LlxuICogQHBhcmFtIGFjdHVhbFxuICogQHBhcmFtIGV4cGVjdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHBlY3RUZW5zb3JzQ2xvc2UoXG4gICAgYWN0dWFsOiBUZW5zb3J8bnVtYmVyW10sIGV4cGVjdGVkOiBUZW5zb3J8bnVtYmVyW10sIGVwc2lsb24/OiBudW1iZXIpIHtcbiAgaWYgKGFjdHVhbCA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoXG4gICAgICAgICdGaXJzdCBhcmd1bWVudCB0byBleHBlY3RUZW5zb3JzQ2xvc2UoKSBpcyBub3QgZGVmaW5lZC4nKTtcbiAgfVxuICBpZiAoZXhwZWN0ZWQgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKFxuICAgICAgICAnU2Vjb25kIGFyZ3VtZW50IHRvIGV4cGVjdFRlbnNvcnNDbG9zZSgpIGlzIG5vdCBkZWZpbmVkLicpO1xuICB9XG4gIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBUZW5zb3IgJiYgZXhwZWN0ZWQgaW5zdGFuY2VvZiBUZW5zb3IpIHtcbiAgICBpZiAoYWN0dWFsLmR0eXBlICE9PSBleHBlY3RlZC5kdHlwZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBEYXRhIHR5cGVzIGRvIG5vdCBtYXRjaC4gQWN0dWFsOiAnJHthY3R1YWwuZHR5cGV9Jy4gYCArXG4gICAgICAgICAgYEV4cGVjdGVkOiAnJHtleHBlY3RlZC5kdHlwZX0nYCk7XG4gICAgfVxuICAgIGlmICghdXRpbC5hcnJheXNFcXVhbChhY3R1YWwuc2hhcGUsIGV4cGVjdGVkLnNoYXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBTaGFwZXMgZG8gbm90IG1hdGNoLiBBY3R1YWw6IFske2FjdHVhbC5zaGFwZX1dLiBgICtcbiAgICAgICAgICBgRXhwZWN0ZWQ6IFske2V4cGVjdGVkLnNoYXBlfV0uYCk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGFjdHVhbERhdGEgPSBhY3R1YWwgaW5zdGFuY2VvZiBUZW5zb3IgPyBhY3R1YWwuZGF0YVN5bmMoKSA6IGFjdHVhbDtcbiAgY29uc3QgZXhwZWN0ZWREYXRhID1cbiAgICAgIGV4cGVjdGVkIGluc3RhbmNlb2YgVGVuc29yID8gZXhwZWN0ZWQuZGF0YVN5bmMoKSA6IGV4cGVjdGVkO1xuICB0ZXN0X3V0aWwuZXhwZWN0QXJyYXlzQ2xvc2UoYWN0dWFsRGF0YSwgZXhwZWN0ZWREYXRhLCBlcHNpbG9uKTtcbn1cblxuLyoqXG4gKiBFeHBlY3QgdmFsdWVzIGluIGFycmF5IGFyZSB3aXRoaW4gYSBzcGVjaWZpZWQgcmFuZ2UsIGJvdW5kYXJpZXMgaW5jbHVzaXZlLlxuICogQHBhcmFtIGFjdHVhbFxuICogQHBhcmFtIGV4cGVjdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHBlY3RUZW5zb3JzVmFsdWVzSW5SYW5nZShcbiAgICBhY3R1YWw6IFRlbnNvciwgbG93OiBudW1iZXIsIGhpZ2g6IG51bWJlcikge1xuICBpZiAoYWN0dWFsID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgJ0ZpcnN0IGFyZ3VtZW50IHRvIGV4cGVjdFRlbnNvcnNDbG9zZSgpIGlzIG5vdCBkZWZpbmVkLicpO1xuICB9XG4gIHRlc3RfdXRpbC5leHBlY3RWYWx1ZXNJblJhbmdlKGFjdHVhbC5kYXRhU3luYygpLCBsb3csIGhpZ2gpO1xufVxuXG4vKipcbiAqIERlc2NyaWJlIHRlc3RzIHRvIGJlIHJ1biBvbiBDUFUgYW5kIEdQVS5cbiAqIEBwYXJhbSB0ZXN0TmFtZVxuICogQHBhcmFtIHRlc3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZU1hdGhDUFVBbmRHUFUodGVzdE5hbWU6IHN0cmluZywgdGVzdHM6ICgpID0+IHZvaWQpIHtcbiAgZGVzY3JpYmVXaXRoRmxhZ3ModGVzdE5hbWUsIEFMTF9FTlZTLCAoKSA9PiB7XG4gICAgdGVzdHMoKTtcbiAgfSk7XG59XG5cbi8qKlxuICogRGVzY3JpYmUgdGVzdHMgdG8gYmUgcnVuIG9uIENQVSBhbmQgR1BVIFdlYkdMMi5cbiAqIEBwYXJhbSB0ZXN0TmFtZVxuICogQHBhcmFtIHRlc3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZU1hdGhDUFVBbmRXZWJHTDIodGVzdE5hbWU6IHN0cmluZywgdGVzdHM6ICgpID0+IHZvaWQpIHtcbiAgZGVzY3JpYmVXaXRoRmxhZ3MoXG4gICAgICB0ZXN0TmFtZSwge1xuICAgICAgICBwcmVkaWNhdGU6IHRlc3RFbnYgPT5cbiAgICAgICAgICAgICh0ZXN0RW52LmZsYWdzID09IG51bGwgfHwgdGVzdEVudi5mbGFnc1snV0VCR0xfVkVSU0lPTiddID09PSAyKVxuICAgICAgfSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGVzdHMoKTtcbiAgICAgIH0pO1xufVxuXG4vKipcbiAqIERlc2NyaWJlIHRlc3RzIHRvIGJlIHJ1biBvbiBDUFUgb25seS5cbiAqIEBwYXJhbSB0ZXN0TmFtZVxuICogQHBhcmFtIHRlc3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZU1hdGhDUFUodGVzdE5hbWU6IHN0cmluZywgdGVzdHM6ICgpID0+IHZvaWQpIHtcbiAgZGVzY3JpYmVXaXRoRmxhZ3MoXG4gICAgICB0ZXN0TmFtZSwge3ByZWRpY2F0ZTogdGVzdEVudiA9PiB0ZXN0RW52LmJhY2tlbmROYW1lID09PSAnY3B1J30sICgpID0+IHtcbiAgICAgICAgdGVzdHMoKTtcbiAgICAgIH0pO1xufVxuXG4vKipcbiAqIERlc2NyaWJlIHRlc3RzIHRvIGJlIHJ1biBvbiBHUFUgb25seS5cbiAqIEBwYXJhbSB0ZXN0TmFtZVxuICogQHBhcmFtIHRlc3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZU1hdGhHUFUodGVzdE5hbWU6IHN0cmluZywgdGVzdHM6ICgpID0+IHZvaWQpIHtcbiAgZGVzY3JpYmVXaXRoRmxhZ3MoXG4gICAgICB0ZXN0TmFtZSwge3ByZWRpY2F0ZTogdGVzdEVudiA9PiB0ZXN0RW52LmJhY2tlbmROYW1lID09PSAnd2ViZ2wnfSwgKCkgPT4ge1xuICAgICAgICB0ZXN0cygpO1xuICAgICAgfSk7XG59XG5cbi8qKlxuICogRGVzY3JpYmUgdGVzdHMgdG8gYmUgcnVuIG9uIFdlYkdMMiBHUFUgb25seS5cbiAqIEBwYXJhbSB0ZXN0TmFtZVxuICogQHBhcmFtIHRlc3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZU1hdGhXZWJHTDIodGVzdE5hbWU6IHN0cmluZywgdGVzdHM6ICgpID0+IHZvaWQpIHtcbiAgZGVzY3JpYmVXaXRoRmxhZ3MoXG4gICAgICB0ZXN0TmFtZSwge1xuICAgICAgICBwcmVkaWNhdGU6IHRlc3RFbnYgPT4gdGVzdEVudi5iYWNrZW5kTmFtZSA9PT0gJ3dlYmdsJyAmJlxuICAgICAgICAgICAgKHRlc3RFbnYuZmxhZ3MgPT0gbnVsbCB8fCB0ZXN0RW52LmZsYWdzWydXRUJHTF9WRVJTSU9OJ10gPT09IDIpXG5cbiAgICAgIH0sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRlc3RzKCk7XG4gICAgICB9KTtcbn1cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgZnVuY3Rpb24gb25seSBnZW5lcmF0ZXMgdGhlIGV4cGVjdGVkIG51bWJlciBvZiBuZXcgVGVuc29ycy5cbiAqXG4gKiBUaGUgdGVzdCAgZnVuY3Rpb24gaXMgY2FsbGVkIHR3aWNlLCBvbmNlIHRvIHByaW1lIGFueSByZWd1bGFyIGNvbnN0YW50cyBhbmRcbiAqIG9uY2UgdG8gZW5zdXJlIHRoYXQgYWRkaXRpb25hbCBjb3BpZXMgYXJlbid0IGNyZWF0ZWQvdGVuc29ycyBhcmVuJ3QgbGVha2VkLlxuICpcbiAqIEBwYXJhbSB0ZXN0RnVuYyBBIGZ1bGx5IGN1cnJpZWQgKHplcm8gYXJnKSB2ZXJzaW9uIG9mIHRoZSBmdW5jdGlvbiB0byB0ZXN0LlxuICogQHBhcmFtIG51bU5ld1RlbnNvcnMgVGhlIGV4cGVjdGVkIG51bWJlciBvZiBuZXcgVGVuc29ycyB0aGF0IHNob3VsZCBleGlzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cGVjdE5vTGVha2VkVGVuc29ycyhcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgdGVzdEZ1bmM6ICgpID0+IGFueSwgbnVtTmV3VGVuc29yczogbnVtYmVyKSB7XG4gIHRlc3RGdW5jKCk7XG4gIGNvbnN0IG51bVRlbnNvcnNCZWZvcmUgPSBtZW1vcnkoKS5udW1UZW5zb3JzO1xuICB0ZXN0RnVuYygpO1xuICBjb25zdCBudW1UZW5zb3JzQWZ0ZXIgPSBtZW1vcnkoKS5udW1UZW5zb3JzO1xuICBjb25zdCBhY3R1YWxOZXdUZW5zb3JzID0gbnVtVGVuc29yc0FmdGVyIC0gbnVtVGVuc29yc0JlZm9yZTtcbiAgaWYgKGFjdHVhbE5ld1RlbnNvcnMgIT09IG51bU5ld1RlbnNvcnMpIHtcbiAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgYENyZWF0ZWQgYW4gdW5leHBlY3RlZCBudW1iZXIgb2YgbmV3IGAgK1xuICAgICAgICBgVGVuc29ycy4gIEV4cGVjdGVkOiAke251bU5ld1RlbnNvcnN9LCBjcmVhdGVkIDogJHtcbiAgICAgICAgICAgIGFjdHVhbE5ld1RlbnNvcnN9LiBgICtcbiAgICAgICAgYFBsZWFzZSBpbnZlc3RpZ2F0ZSB0aGUgZGlzY3JlcGVuY3kgYW5kL29yIHVzZSB0aWR5LmApO1xuICB9XG59XG4iXX0=