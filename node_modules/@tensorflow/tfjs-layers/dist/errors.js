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
 * Explicit error types.
 *
 * See the following link for more information about why the code includes
 * calls to setPrototypeOf:
 *
 * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
 */
// tslint:enable
/**
 * Equivalent of Python's AttributeError.
 */
export class AttributeError extends Error {
    constructor(message) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AttributeError.prototype);
    }
}
/**
 * Equivalent of Python's RuntimeError.
 */
export class RuntimeError extends Error {
    constructor(message) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RuntimeError.prototype);
    }
}
/**
 * Equivalent of Python's ValueError.
 */
export class ValueError extends Error {
    constructor(message) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ValueError.prototype);
    }
}
/**
 * Equivalent of Python's NotImplementedError.
 */
export class NotImplementedError extends Error {
    constructor(message) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NotImplementedError.prototype);
    }
}
/**
 * Equivalent of Python's AssertionError.
 */
export class AssertionError extends Error {
    constructor(message) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AssertionError.prototype);
    }
}
/**
 * Equivalent of Python's IndexError.
 */
export class IndexError extends Error {
    constructor(message) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, IndexError.prototype);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1sYXllcnMvc3JjL2Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUVIOzs7Ozs7O0dBT0c7QUFDSCxnQkFBZ0I7QUFFaEI7O0dBRUc7QUFDSCxNQUFNLE9BQU8sY0FBZSxTQUFRLEtBQUs7SUFDdkMsWUFBWSxPQUFnQjtRQUMxQixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixnQ0FBZ0M7UUFDaEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7Q0FDRjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFlBQWEsU0FBUSxLQUFLO0lBQ3JDLFlBQVksT0FBZ0I7UUFDMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsZ0NBQWdDO1FBQ2hDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0RCxDQUFDO0NBQ0Y7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxVQUFXLFNBQVEsS0FBSztJQUNuQyxZQUFZLE9BQWdCO1FBQzFCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLGdDQUFnQztRQUNoQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNGO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsS0FBSztJQUM1QyxZQUFZLE9BQWdCO1FBQzFCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLGdDQUFnQztRQUNoQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3RCxDQUFDO0NBQ0Y7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxjQUFlLFNBQVEsS0FBSztJQUN2QyxZQUFZLE9BQWdCO1FBQzFCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLGdDQUFnQztRQUNoQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNGO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sVUFBVyxTQUFRLEtBQUs7SUFDbkMsWUFBWSxPQUFnQjtRQUMxQixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixnQ0FBZ0M7UUFDaEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAqIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8qKlxuICogRXhwbGljaXQgZXJyb3IgdHlwZXMuXG4gKlxuICogU2VlIHRoZSBmb2xsb3dpbmcgbGluayBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB3aHkgdGhlIGNvZGUgaW5jbHVkZXNcbiAqIGNhbGxzIHRvIHNldFByb3RvdHlwZU9mOlxuICpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC13aWtpL2Jsb2IvbWFzdGVyL0JyZWFraW5nLUNoYW5nZXMubWQjZXh0ZW5kaW5nLWJ1aWx0LWlucy1saWtlLWVycm9yLWFycmF5LWFuZC1tYXAtbWF5LW5vLWxvbmdlci13b3JrXG4gKi9cbi8vIHRzbGludDplbmFibGVcblxuLyoqXG4gKiBFcXVpdmFsZW50IG9mIFB5dGhvbidzIEF0dHJpYnV0ZUVycm9yLlxuICovXG5leHBvcnQgY2xhc3MgQXR0cmlidXRlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAvLyBTZXQgdGhlIHByb3RvdHlwZSBleHBsaWNpdGx5LlxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBBdHRyaWJ1dGVFcnJvci5wcm90b3R5cGUpO1xuICB9XG59XG5cbi8qKlxuICogRXF1aXZhbGVudCBvZiBQeXRob24ncyBSdW50aW1lRXJyb3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBSdW50aW1lRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAvLyBTZXQgdGhlIHByb3RvdHlwZSBleHBsaWNpdGx5LlxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBSdW50aW1lRXJyb3IucHJvdG90eXBlKTtcbiAgfVxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgb2YgUHl0aG9uJ3MgVmFsdWVFcnJvci5cbiAqL1xuZXhwb3J0IGNsYXNzIFZhbHVlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAvLyBTZXQgdGhlIHByb3RvdHlwZSBleHBsaWNpdGx5LlxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBWYWx1ZUVycm9yLnByb3RvdHlwZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IG9mIFB5dGhvbidzIE5vdEltcGxlbWVudGVkRXJyb3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBOb3RJbXBsZW1lbnRlZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgLy8gU2V0IHRoZSBwcm90b3R5cGUgZXhwbGljaXRseS5cbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgTm90SW1wbGVtZW50ZWRFcnJvci5wcm90b3R5cGUpO1xuICB9XG59XG5cbi8qKlxuICogRXF1aXZhbGVudCBvZiBQeXRob24ncyBBc3NlcnRpb25FcnJvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEFzc2VydGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgLy8gU2V0IHRoZSBwcm90b3R5cGUgZXhwbGljaXRseS5cbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgQXNzZXJ0aW9uRXJyb3IucHJvdG90eXBlKTtcbiAgfVxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgb2YgUHl0aG9uJ3MgSW5kZXhFcnJvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEluZGV4RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAvLyBTZXQgdGhlIHByb3RvdHlwZSBleHBsaWNpdGx5LlxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBJbmRleEVycm9yLnByb3RvdHlwZSk7XG4gIH1cbn1cbiJdfQ==