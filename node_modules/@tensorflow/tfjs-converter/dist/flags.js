/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
import { env } from '@tensorflow/tfjs-core';
const ENV = env();
/** Whether to keep intermediate tensors. */
ENV.registerFlag('KEEP_INTERMEDIATE_TENSORS', () => false, debugValue => {
    if (debugValue) {
        console.warn('Keep intermediate tensors is ON. This will print the values of all ' +
            'intermediate tensors during model inference. Not all models ' +
            'support this mode. For details, check e2e/benchmarks/ ' +
            'model_config.js. This significantly impacts performance.');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWNvbnZlcnRlci9zcmMvZmxhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBRWxCLDRDQUE0QztBQUM1QyxHQUFHLENBQUMsWUFBWSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRTtJQUN0RSxJQUFJLFVBQVUsRUFBRTtRQUNkLE9BQU8sQ0FBQyxJQUFJLENBQ1IscUVBQXFFO1lBQ3JFLDhEQUE4RDtZQUM5RCx3REFBd0Q7WUFDeEQsMERBQTBELENBQUMsQ0FBQztLQUNqRTtBQUNILENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2Vudn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuY29uc3QgRU5WID0gZW52KCk7XG5cbi8qKiBXaGV0aGVyIHRvIGtlZXAgaW50ZXJtZWRpYXRlIHRlbnNvcnMuICovXG5FTlYucmVnaXN0ZXJGbGFnKCdLRUVQX0lOVEVSTUVESUFURV9URU5TT1JTJywgKCkgPT4gZmFsc2UsIGRlYnVnVmFsdWUgPT4ge1xuICBpZiAoZGVidWdWYWx1ZSkge1xuICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ0tlZXAgaW50ZXJtZWRpYXRlIHRlbnNvcnMgaXMgT04uIFRoaXMgd2lsbCBwcmludCB0aGUgdmFsdWVzIG9mIGFsbCAnICtcbiAgICAgICAgJ2ludGVybWVkaWF0ZSB0ZW5zb3JzIGR1cmluZyBtb2RlbCBpbmZlcmVuY2UuIE5vdCBhbGwgbW9kZWxzICcgK1xuICAgICAgICAnc3VwcG9ydCB0aGlzIG1vZGUuIEZvciBkZXRhaWxzLCBjaGVjayBlMmUvYmVuY2htYXJrcy8gJyArXG4gICAgICAgICdtb2RlbF9jb25maWcuanMuIFRoaXMgc2lnbmlmaWNhbnRseSBpbXBhY3RzIHBlcmZvcm1hbmNlLicpO1xuICB9XG59KTtcbiJdfQ==