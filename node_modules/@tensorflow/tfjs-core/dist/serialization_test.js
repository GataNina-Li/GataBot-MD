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
import { Optimizer } from './optimizers/optimizer';
import { registerClass, SerializationMap } from './serialization';
describe('registerClass', () => {
    const randomClassName = `OptimizerForTest${Math.random()}`;
    class OptimizerForTest extends Optimizer {
        constructor() {
            super();
        }
        applyGradients(variableGradients) { }
        getConfig() {
            return {};
        }
    }
    OptimizerForTest.className = randomClassName;
    it('registerClass succeeds', () => {
        registerClass(OptimizerForTest);
        expect(SerializationMap.getMap().classNameMap[randomClassName] != null)
            .toEqual(true);
    });
    class OptimizerWithoutClassName extends Optimizer {
        constructor() {
            super();
        }
        applyGradients(variableGradients) { }
        getConfig() {
            return {};
        }
    }
    it('registerClass fails on missing className', () => {
        // tslint:disable-next-line:no-any
        expect(() => registerClass(OptimizerWithoutClassName))
            .toThrowError(/does not have the static className property/);
    });
    class OptimizerWithEmptyClassName extends Optimizer {
        constructor() {
            super();
        }
        applyGradients(variableGradients) { }
        getConfig() {
            return {};
        }
    }
    OptimizerWithEmptyClassName.className = '';
    it('registerClass fails on missing className', () => {
        expect(() => registerClass(OptimizerWithEmptyClassName))
            .toThrowError(/has an empty-string as its className/);
    });
    class OptimizerWithNonStringClassName extends Optimizer {
        constructor() {
            super();
        }
        applyGradients(variableGradients) { }
        getConfig() {
            return {};
        }
    }
    OptimizerWithNonStringClassName.className = 42;
    it('registerClass fails on missing className', () => {
        // tslint:disable-next-line:no-any
        expect(() => registerClass(OptimizerWithNonStringClassName))
            .toThrowError(/is required to be a string, but got type number/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXphdGlvbl90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9zZXJpYWxpemF0aW9uX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2pELE9BQU8sRUFBYSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUc1RSxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixNQUFNLGVBQWUsR0FBRyxtQkFBbUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7SUFDM0QsTUFBTSxnQkFBaUIsU0FBUSxTQUFTO1FBRXRDO1lBQ0UsS0FBSyxFQUFFLENBQUM7UUFDVixDQUFDO1FBQ0QsY0FBYyxDQUFDLGlCQUFtQyxJQUFHLENBQUM7UUFFdEQsU0FBUztZQUNQLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQzs7SUFSTSwwQkFBUyxHQUFHLGVBQWUsQ0FBQztJQVVyQyxFQUFFLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxDQUFDO2FBQ2xFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0seUJBQTBCLFNBQVEsU0FBUztRQUMvQztZQUNFLEtBQUssRUFBRSxDQUFDO1FBQ1YsQ0FBQztRQUNELGNBQWMsQ0FBQyxpQkFBbUMsSUFBRyxDQUFDO1FBRXRELFNBQVM7WUFDUCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7S0FDRjtJQUNELEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDbEQsa0NBQWtDO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMseUJBQWdDLENBQUMsQ0FBQzthQUN4RCxZQUFZLENBQUMsNkNBQTZDLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sMkJBQTRCLFNBQVEsU0FBUztRQUVqRDtZQUNFLEtBQUssRUFBRSxDQUFDO1FBQ1YsQ0FBQztRQUNELGNBQWMsQ0FBQyxpQkFBbUMsSUFBRyxDQUFDO1FBRXRELFNBQVM7WUFDUCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7O0lBUk0scUNBQVMsR0FBRyxFQUFFLENBQUM7SUFVeEIsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtRQUNsRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLENBQUM7YUFDbkQsWUFBWSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLCtCQUFnQyxTQUFRLFNBQVM7UUFFckQ7WUFDRSxLQUFLLEVBQUUsQ0FBQztRQUNWLENBQUM7UUFDRCxjQUFjLENBQUMsaUJBQW1DLElBQUcsQ0FBQztRQUV0RCxTQUFTO1lBQ1AsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDOztJQVJNLHlDQUFTLEdBQUcsRUFBRSxDQUFDO0lBVXhCLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDbEQsa0NBQWtDO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsK0JBQXNDLENBQUMsQ0FBQzthQUM5RCxZQUFZLENBQUMsaURBQWlELENBQUMsQ0FBQztJQUN2RSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge09wdGltaXplcn0gZnJvbSAnLi9vcHRpbWl6ZXJzL29wdGltaXplcic7XG5pbXBvcnQge0NvbmZpZ0RpY3QsIHJlZ2lzdGVyQ2xhc3MsIFNlcmlhbGl6YXRpb25NYXB9IGZyb20gJy4vc2VyaWFsaXphdGlvbic7XG5pbXBvcnQge05hbWVkVmFyaWFibGVNYXB9IGZyb20gJy4vdGVuc29yX3R5cGVzJztcblxuZGVzY3JpYmUoJ3JlZ2lzdGVyQ2xhc3MnLCAoKSA9PiB7XG4gIGNvbnN0IHJhbmRvbUNsYXNzTmFtZSA9IGBPcHRpbWl6ZXJGb3JUZXN0JHtNYXRoLnJhbmRvbSgpfWA7XG4gIGNsYXNzIE9wdGltaXplckZvclRlc3QgZXh0ZW5kcyBPcHRpbWl6ZXIge1xuICAgIHN0YXRpYyBjbGFzc05hbWUgPSByYW5kb21DbGFzc05hbWU7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBhcHBseUdyYWRpZW50cyh2YXJpYWJsZUdyYWRpZW50czogTmFtZWRWYXJpYWJsZU1hcCkge31cblxuICAgIGdldENvbmZpZygpOiBDb25maWdEaWN0IHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cbiAgaXQoJ3JlZ2lzdGVyQ2xhc3Mgc3VjY2VlZHMnLCAoKSA9PiB7XG4gICAgcmVnaXN0ZXJDbGFzcyhPcHRpbWl6ZXJGb3JUZXN0KTtcbiAgICBleHBlY3QoU2VyaWFsaXphdGlvbk1hcC5nZXRNYXAoKS5jbGFzc05hbWVNYXBbcmFuZG9tQ2xhc3NOYW1lXSAhPSBudWxsKVxuICAgICAgICAudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgY2xhc3MgT3B0aW1pemVyV2l0aG91dENsYXNzTmFtZSBleHRlbmRzIE9wdGltaXplciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBhcHBseUdyYWRpZW50cyh2YXJpYWJsZUdyYWRpZW50czogTmFtZWRWYXJpYWJsZU1hcCkge31cblxuICAgIGdldENvbmZpZygpOiBDb25maWdEaWN0IHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cbiAgaXQoJ3JlZ2lzdGVyQ2xhc3MgZmFpbHMgb24gbWlzc2luZyBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIGV4cGVjdCgoKSA9PiByZWdpc3RlckNsYXNzKE9wdGltaXplcldpdGhvdXRDbGFzc05hbWUgYXMgYW55KSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvZG9lcyBub3QgaGF2ZSB0aGUgc3RhdGljIGNsYXNzTmFtZSBwcm9wZXJ0eS8pO1xuICB9KTtcblxuICBjbGFzcyBPcHRpbWl6ZXJXaXRoRW1wdHlDbGFzc05hbWUgZXh0ZW5kcyBPcHRpbWl6ZXIge1xuICAgIHN0YXRpYyBjbGFzc05hbWUgPSAnJztcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIGFwcGx5R3JhZGllbnRzKHZhcmlhYmxlR3JhZGllbnRzOiBOYW1lZFZhcmlhYmxlTWFwKSB7fVxuXG4gICAgZ2V0Q29uZmlnKCk6IENvbmZpZ0RpY3Qge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuICBpdCgncmVnaXN0ZXJDbGFzcyBmYWlscyBvbiBtaXNzaW5nIGNsYXNzTmFtZScsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gcmVnaXN0ZXJDbGFzcyhPcHRpbWl6ZXJXaXRoRW1wdHlDbGFzc05hbWUpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9oYXMgYW4gZW1wdHktc3RyaW5nIGFzIGl0cyBjbGFzc05hbWUvKTtcbiAgfSk7XG5cbiAgY2xhc3MgT3B0aW1pemVyV2l0aE5vblN0cmluZ0NsYXNzTmFtZSBleHRlbmRzIE9wdGltaXplciB7XG4gICAgc3RhdGljIGNsYXNzTmFtZSA9IDQyO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgYXBwbHlHcmFkaWVudHModmFyaWFibGVHcmFkaWVudHM6IE5hbWVkVmFyaWFibGVNYXApIHt9XG5cbiAgICBnZXRDb25maWcoKTogQ29uZmlnRGljdCB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG4gIGl0KCdyZWdpc3RlckNsYXNzIGZhaWxzIG9uIG1pc3NpbmcgY2xhc3NOYW1lJywgKCkgPT4ge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBleHBlY3QoKCkgPT4gcmVnaXN0ZXJDbGFzcyhPcHRpbWl6ZXJXaXRoTm9uU3RyaW5nQ2xhc3NOYW1lIGFzIGFueSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL2lzIHJlcXVpcmVkIHRvIGJlIGEgc3RyaW5nLCBidXQgZ290IHR5cGUgbnVtYmVyLyk7XG4gIH0pO1xufSk7XG4iXX0=