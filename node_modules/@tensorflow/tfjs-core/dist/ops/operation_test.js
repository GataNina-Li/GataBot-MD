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
import { ALL_ENVS, describeWithFlags } from '../jasmine_util';
import { op } from './operation';
describeWithFlags('operation', ALL_ENVS, () => {
    it('executes and preserves function name', () => {
        const f = () => 2;
        const opfn = op({ 'opName': f });
        expect(opfn.name).toBe('opName__op');
        expect(opfn()).toBe(2);
    });
    it('executes, preserves function name, strips underscore', () => {
        const f = () => 2;
        const opfn = op({ 'opName_': f });
        expect(opfn.name).toBe('opName__op');
        expect(opfn()).toBe(2);
    });
    it('throws when passing an object with multiple keys', () => {
        const f = () => 2;
        expect(() => op({ 'opName_': f, 'opName2_': f }))
            .toThrowError(/Please provide an object with a single key/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0aW9uX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9vcGVyYXRpb25fdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQixpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUM1QyxFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1FBQzlDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsRUFBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUUvQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1FBQzlELE1BQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUVoQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1FBQzFELE1BQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQzthQUMxQyxZQUFZLENBQUMsNENBQTRDLENBQUMsQ0FBQztJQUNsRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtBTExfRU5WUywgZGVzY3JpYmVXaXRoRmxhZ3N9IGZyb20gJy4uL2phc21pbmVfdXRpbCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdvcGVyYXRpb24nLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnZXhlY3V0ZXMgYW5kIHByZXNlcnZlcyBmdW5jdGlvbiBuYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IGYgPSAoKSA9PiAyO1xuICAgIGNvbnN0IG9wZm4gPSBvcCh7J29wTmFtZSc6IGZ9KTtcblxuICAgIGV4cGVjdChvcGZuLm5hbWUpLnRvQmUoJ29wTmFtZV9fb3AnKTtcbiAgICBleHBlY3Qob3BmbigpKS50b0JlKDIpO1xuICB9KTtcblxuICBpdCgnZXhlY3V0ZXMsIHByZXNlcnZlcyBmdW5jdGlvbiBuYW1lLCBzdHJpcHMgdW5kZXJzY29yZScsICgpID0+IHtcbiAgICBjb25zdCBmID0gKCkgPT4gMjtcbiAgICBjb25zdCBvcGZuID0gb3AoeydvcE5hbWVfJzogZn0pO1xuXG4gICAgZXhwZWN0KG9wZm4ubmFtZSkudG9CZSgnb3BOYW1lX19vcCcpO1xuICAgIGV4cGVjdChvcGZuKCkpLnRvQmUoMik7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBwYXNzaW5nIGFuIG9iamVjdCB3aXRoIG11bHRpcGxlIGtleXMnLCAoKSA9PiB7XG4gICAgY29uc3QgZiA9ICgpID0+IDI7XG4gICAgZXhwZWN0KCgpID0+IG9wKHsnb3BOYW1lXyc6IGYsICdvcE5hbWUyXyc6IGZ9KSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvUGxlYXNlIHByb3ZpZGUgYW4gb2JqZWN0IHdpdGggYSBzaW5nbGUga2V5Lyk7XG4gIH0pO1xufSk7XG4iXX0=