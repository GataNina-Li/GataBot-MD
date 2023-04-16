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
/**
 * This file tests that we don't have any dataSyncs in the unconstrainted tests
 * so that we can run backends that have async init and async data reads against
 * our exported test files.
 */
// Use require here to workaround this being a circular dependency.
// This should only be done in tests.
// tslint:disable-next-line: no-require-imports
require('@tensorflow/tfjs-backend-cpu');
import './index';
import './public/chained_ops/register_all_chained_ops';
import './register_all_gradients';
import { setTestEnvs } from './jasmine_util';
import { registerBackend, engine } from './globals';
import { KernelBackend } from './backends/backend';
import { getKernelsForBackend, registerKernel } from './kernel_registry';
// tslint:disable-next-line:no-require-imports
const jasmine = require('jasmine');
process.on('unhandledRejection', e => {
    throw e;
});
class AsyncCPUBackend extends KernelBackend {
}
const asyncBackend = new AsyncCPUBackend();
// backend is cast as any so that we can access methods through bracket
// notation.
const backend = engine().findBackend('cpu');
const proxyBackend = new Proxy(asyncBackend, {
    get(target, name, receiver) {
        if (name === 'readSync') {
            throw new Error(`Found dataSync() in a unit test. This is disabled so unit tests ` +
                `can run in backends that only support async data. Please use ` +
                `.data() in unit tests or if you truly are testing dataSync(), ` +
                `constrain your test with SYNC_BACKEND_ENVS`);
        }
        //@ts-ignore;
        const origSymbol = backend[name];
        if (typeof origSymbol === 'function') {
            // tslint:disable-next-line:no-any
            return (...args) => {
                return origSymbol.apply(backend, args);
            };
        }
        else {
            return origSymbol;
        }
    }
});
const proxyBackendName = 'test-async-cpu';
// The registration is async on purpose, so we know our testing infra works
// with backends that have async init (e.g. WASM and WebGPU).
registerBackend(proxyBackendName, async () => proxyBackend);
// All the kernels are registered under the 'cpu' name, so we need to
// register them also under the proxy backend name.
const kernels = getKernelsForBackend('cpu');
kernels.forEach(({ kernelName, kernelFunc, setupFunc }) => {
    registerKernel({ kernelName, backendName: proxyBackendName, kernelFunc, setupFunc });
});
setTestEnvs([{
        name: proxyBackendName,
        backendName: proxyBackendName,
        isDataSync: false,
    }]);
const runner = new jasmine();
runner.loadConfig({ spec_files: ['tfjs-core/src/**/**_test.js'], random: false });
runner.execute();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9hc3luY19iYWNrZW5kcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvdGVzdF9hc3luY19iYWNrZW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSDs7OztHQUlHO0FBRUgsbUVBQW1FO0FBQ25FLHFDQUFxQztBQUNyQywrQ0FBK0M7QUFDL0MsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDeEMsT0FBTyxTQUFTLENBQUM7QUFDakIsT0FBTywrQ0FBK0MsQ0FBQztBQUN2RCxPQUFPLDBCQUEwQixDQUFDO0FBQ2xDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsZUFBZSxFQUFFLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNsRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDakQsT0FBTyxFQUFDLG9CQUFvQixFQUFFLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXZFLDhDQUE4QztBQUM5QyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFbkMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUNuQyxNQUFNLENBQUMsQ0FBQztBQUNWLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxlQUFnQixTQUFRLGFBQWE7Q0FBRztBQUM5QyxNQUFNLFlBQVksR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0FBRTNDLHVFQUF1RTtBQUN2RSxZQUFZO0FBQ1osTUFBTSxPQUFPLEdBQWtCLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRCxNQUFNLFlBQVksR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7SUFDM0MsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUTtRQUN4QixJQUFJLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FDWCxrRUFBa0U7Z0JBQ2xFLCtEQUErRDtnQkFDL0QsZ0VBQWdFO2dCQUNoRSw0Q0FBNEMsQ0FBQyxDQUFDO1NBQ25EO1FBQ0QsYUFBYTtRQUNiLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFVBQVUsRUFBRTtZQUNwQyxrQ0FBa0M7WUFDbEMsT0FBTyxDQUFDLEdBQUcsSUFBVyxFQUFFLEVBQUU7Z0JBQ3hCLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDO1NBQ0g7YUFBTTtZQUNMLE9BQU8sVUFBVSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7QUFFMUMsMkVBQTJFO0FBQzNFLDZEQUE2RDtBQUM3RCxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUU1RCxxRUFBcUU7QUFDckUsbURBQW1EO0FBQ25ELE1BQU0sT0FBTyxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDLEVBQUUsRUFBRTtJQUN0RCxjQUFjLENBQ1YsRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQzFFLENBQUMsQ0FBQyxDQUFDO0FBRUgsV0FBVyxDQUFDLENBQUM7UUFDWCxJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLFdBQVcsRUFBRSxnQkFBZ0I7UUFDN0IsVUFBVSxFQUFFLEtBQUs7S0FDbEIsQ0FBQyxDQUFDLENBQUM7QUFFSixNQUFNLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBRTdCLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBQyxVQUFVLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0FBQ2hGLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbi8qKlxuICogVGhpcyBmaWxlIHRlc3RzIHRoYXQgd2UgZG9uJ3QgaGF2ZSBhbnkgZGF0YVN5bmNzIGluIHRoZSB1bmNvbnN0cmFpbnRlZCB0ZXN0c1xuICogc28gdGhhdCB3ZSBjYW4gcnVuIGJhY2tlbmRzIHRoYXQgaGF2ZSBhc3luYyBpbml0IGFuZCBhc3luYyBkYXRhIHJlYWRzIGFnYWluc3RcbiAqIG91ciBleHBvcnRlZCB0ZXN0IGZpbGVzLlxuICovXG5cbi8vIFVzZSByZXF1aXJlIGhlcmUgdG8gd29ya2Fyb3VuZCB0aGlzIGJlaW5nIGEgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbi8vIFRoaXMgc2hvdWxkIG9ubHkgYmUgZG9uZSBpbiB0ZXN0cy5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tcmVxdWlyZS1pbXBvcnRzXG5yZXF1aXJlKCdAdGVuc29yZmxvdy90ZmpzLWJhY2tlbmQtY3B1Jyk7XG5pbXBvcnQgJy4vaW5kZXgnO1xuaW1wb3J0ICcuL3B1YmxpYy9jaGFpbmVkX29wcy9yZWdpc3Rlcl9hbGxfY2hhaW5lZF9vcHMnO1xuaW1wb3J0ICcuL3JlZ2lzdGVyX2FsbF9ncmFkaWVudHMnO1xuaW1wb3J0IHtzZXRUZXN0RW52c30gZnJvbSAnLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtyZWdpc3RlckJhY2tlbmQsIGVuZ2luZX0gZnJvbSAnLi9nbG9iYWxzJztcbmltcG9ydCB7S2VybmVsQmFja2VuZH0gZnJvbSAnLi9iYWNrZW5kcy9iYWNrZW5kJztcbmltcG9ydCB7Z2V0S2VybmVsc0ZvckJhY2tlbmQsIHJlZ2lzdGVyS2VybmVsfSBmcm9tICcuL2tlcm5lbF9yZWdpc3RyeSc7XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1yZXF1aXJlLWltcG9ydHNcbmNvbnN0IGphc21pbmUgPSByZXF1aXJlKCdqYXNtaW5lJyk7XG5cbnByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIGUgPT4ge1xuICB0aHJvdyBlO1xufSk7XG5cbmNsYXNzIEFzeW5jQ1BVQmFja2VuZCBleHRlbmRzIEtlcm5lbEJhY2tlbmQge31cbmNvbnN0IGFzeW5jQmFja2VuZCA9IG5ldyBBc3luY0NQVUJhY2tlbmQoKTtcblxuLy8gYmFja2VuZCBpcyBjYXN0IGFzIGFueSBzbyB0aGF0IHdlIGNhbiBhY2Nlc3MgbWV0aG9kcyB0aHJvdWdoIGJyYWNrZXRcbi8vIG5vdGF0aW9uLlxuY29uc3QgYmFja2VuZDogS2VybmVsQmFja2VuZCA9IGVuZ2luZSgpLmZpbmRCYWNrZW5kKCdjcHUnKTtcbmNvbnN0IHByb3h5QmFja2VuZCA9IG5ldyBQcm94eShhc3luY0JhY2tlbmQsIHtcbiAgZ2V0KHRhcmdldCwgbmFtZSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAobmFtZSA9PT0gJ3JlYWRTeW5jJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBGb3VuZCBkYXRhU3luYygpIGluIGEgdW5pdCB0ZXN0LiBUaGlzIGlzIGRpc2FibGVkIHNvIHVuaXQgdGVzdHMgYCArXG4gICAgICAgICAgYGNhbiBydW4gaW4gYmFja2VuZHMgdGhhdCBvbmx5IHN1cHBvcnQgYXN5bmMgZGF0YS4gUGxlYXNlIHVzZSBgICtcbiAgICAgICAgICBgLmRhdGEoKSBpbiB1bml0IHRlc3RzIG9yIGlmIHlvdSB0cnVseSBhcmUgdGVzdGluZyBkYXRhU3luYygpLCBgICtcbiAgICAgICAgICBgY29uc3RyYWluIHlvdXIgdGVzdCB3aXRoIFNZTkNfQkFDS0VORF9FTlZTYCk7XG4gICAgfVxuICAgIC8vQHRzLWlnbm9yZTtcbiAgICBjb25zdCBvcmlnU3ltYm9sID0gYmFja2VuZFtuYW1lXTtcbiAgICBpZiAodHlwZW9mIG9yaWdTeW1ib2wgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgcmV0dXJuIG9yaWdTeW1ib2wuYXBwbHkoYmFja2VuZCwgYXJncyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JpZ1N5bWJvbDtcbiAgICB9XG4gIH1cbn0pO1xuXG5jb25zdCBwcm94eUJhY2tlbmROYW1lID0gJ3Rlc3QtYXN5bmMtY3B1JztcblxuLy8gVGhlIHJlZ2lzdHJhdGlvbiBpcyBhc3luYyBvbiBwdXJwb3NlLCBzbyB3ZSBrbm93IG91ciB0ZXN0aW5nIGluZnJhIHdvcmtzXG4vLyB3aXRoIGJhY2tlbmRzIHRoYXQgaGF2ZSBhc3luYyBpbml0IChlLmcuIFdBU00gYW5kIFdlYkdQVSkuXG5yZWdpc3RlckJhY2tlbmQocHJveHlCYWNrZW5kTmFtZSwgYXN5bmMgKCkgPT4gcHJveHlCYWNrZW5kKTtcblxuLy8gQWxsIHRoZSBrZXJuZWxzIGFyZSByZWdpc3RlcmVkIHVuZGVyIHRoZSAnY3B1JyBuYW1lLCBzbyB3ZSBuZWVkIHRvXG4vLyByZWdpc3RlciB0aGVtIGFsc28gdW5kZXIgdGhlIHByb3h5IGJhY2tlbmQgbmFtZS5cbmNvbnN0IGtlcm5lbHMgPSBnZXRLZXJuZWxzRm9yQmFja2VuZCgnY3B1Jyk7XG5rZXJuZWxzLmZvckVhY2goKHtrZXJuZWxOYW1lLCBrZXJuZWxGdW5jLCBzZXR1cEZ1bmN9KSA9PiB7XG4gIHJlZ2lzdGVyS2VybmVsKFxuICAgICAge2tlcm5lbE5hbWUsIGJhY2tlbmROYW1lOiBwcm94eUJhY2tlbmROYW1lLCBrZXJuZWxGdW5jLCBzZXR1cEZ1bmN9KTtcbn0pO1xuXG5zZXRUZXN0RW52cyhbe1xuICBuYW1lOiBwcm94eUJhY2tlbmROYW1lLFxuICBiYWNrZW5kTmFtZTogcHJveHlCYWNrZW5kTmFtZSxcbiAgaXNEYXRhU3luYzogZmFsc2UsXG59XSk7XG5cbmNvbnN0IHJ1bm5lciA9IG5ldyBqYXNtaW5lKCk7XG5cbnJ1bm5lci5sb2FkQ29uZmlnKHtzcGVjX2ZpbGVzOiBbJ3RmanMtY29yZS9zcmMvKiovKipfdGVzdC5qcyddLCByYW5kb206IGZhbHNlfSk7XG5ydW5uZXIuZXhlY3V0ZSgpO1xuIl19