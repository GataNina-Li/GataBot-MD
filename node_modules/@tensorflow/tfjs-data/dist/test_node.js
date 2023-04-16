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
import '@tensorflow/tfjs-backend-cpu';
// tslint:disable-next-line: no-imports-from-dist
import { setTestEnvs } from '@tensorflow/tfjs-core/dist/jasmine_util';
// tslint:disable-next-line:no-require-imports
const jasmine = require('jasmine');
process.on('unhandledRejection', e => {
    throw e;
});
setTestEnvs([{ name: 'node', backendName: 'cpu' }]);
const unitTests = 'tfjs-data/src/**/*_test.js';
const runner = new jasmine();
runner.loadConfig({ spec_files: [unitTests], random: false });
runner.execute();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9ub2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1kYXRhL3NyYy90ZXN0X25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyw4QkFBOEIsQ0FBQztBQUN0QyxpREFBaUQ7QUFDakQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHlDQUF5QyxDQUFDO0FBRXBFLDhDQUE4QztBQUM5QyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFbkMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUNuQyxNQUFNLENBQUMsQ0FBQztBQUNWLENBQUMsQ0FBQyxDQUFDO0FBRUgsV0FBVyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEQsTUFBTSxTQUFTLEdBQUcsNEJBQTRCLENBQUM7QUFDL0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUM3QixNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7QUFDNUQsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgJ0B0ZW5zb3JmbG93L3RmanMtYmFja2VuZC1jcHUnO1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1pbXBvcnRzLWZyb20tZGlzdFxuaW1wb3J0IHtzZXRUZXN0RW52c30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlL2Rpc3QvamFzbWluZV91dGlsJztcblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXJlcXVpcmUtaW1wb3J0c1xuY29uc3QgamFzbWluZSA9IHJlcXVpcmUoJ2phc21pbmUnKTtcblxucHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgZSA9PiB7XG4gIHRocm93IGU7XG59KTtcblxuc2V0VGVzdEVudnMoW3tuYW1lOiAnbm9kZScsIGJhY2tlbmROYW1lOiAnY3B1J31dKTtcbmNvbnN0IHVuaXRUZXN0cyA9ICd0ZmpzLWRhdGEvc3JjLyoqLypfdGVzdC5qcyc7XG5jb25zdCBydW5uZXIgPSBuZXcgamFzbWluZSgpO1xucnVubmVyLmxvYWRDb25maWcoe3NwZWNfZmlsZXM6IFt1bml0VGVzdHNdLCByYW5kb206IGZhbHNlfSk7XG5ydW5uZXIuZXhlY3V0ZSgpO1xuIl19