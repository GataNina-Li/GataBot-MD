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
const CUSTOM_OPS = {};
/**
 * Register an Op for graph model executor. This allows you to register
 * TensorFlow custom op or override existing op.
 *
 * Here is an example of registering a new MatMul Op.
 * ```js
 * const customMatmul = (node) =>
 *    tf.matMul(
 *        node.inputs[0], node.inputs[1],
 *        node.attrs['transpose_a'], node.attrs['transpose_b']);
 *
 * tf.registerOp('MatMul', customMatmul);
 * ```
 * The inputs and attrs of the node object are based on the TensorFlow op
 * registry.
 *
 * @param name The Tensorflow Op name.
 * @param opFunc An op function which is called with the current graph node
 * during execution and needs to return a tensor or a list of tensors. The node
 * has the following attributes:
 *    - attr: A map from attribute name to its value
 *    - inputs: A list of input tensors
 *
 * @doc {heading: 'Models', subheading: 'Op Registry'}
 */
export function registerOp(name, opFunc) {
    const opMapper = {
        tfOpName: name,
        category: 'custom',
        inputs: [],
        attrs: [],
        customExecutor: opFunc
    };
    CUSTOM_OPS[name] = opMapper;
}
/**
 * Retrieve the OpMapper object for the registered op.
 *
 * @param name The Tensorflow Op name.
 *
 * @doc {heading: 'Models', subheading: 'Op Registry'}
 */
export function getRegisteredOp(name) {
    return CUSTOM_OPS[name];
}
/**
 * Deregister the Op for graph model executor.
 *
 * @param name The Tensorflow Op name.
 *
 * @doc {heading: 'Models', subheading: 'Op Registry'}
 */
export function deregisterOp(name) {
    delete CUSTOM_OPS[name];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvbnZlcnRlci9zcmMvb3BlcmF0aW9ucy9jdXN0b21fb3AvcmVnaXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBSUgsTUFBTSxVQUFVLEdBQThCLEVBQUUsQ0FBQztBQUVqRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBQyxJQUFZLEVBQUUsTUFBa0I7SUFDekQsTUFBTSxRQUFRLEdBQWE7UUFDekIsUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsUUFBUTtRQUNsQixNQUFNLEVBQUUsRUFBRTtRQUNWLEtBQUssRUFBRSxFQUFFO1FBQ1QsY0FBYyxFQUFFLE1BQU07S0FDdkIsQ0FBQztJQUVGLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7QUFDOUIsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxlQUFlLENBQUMsSUFBWTtJQUMxQyxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxJQUFZO0lBQ3ZDLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtPcEV4ZWN1dG9yLCBPcE1hcHBlcn0gZnJvbSAnLi4vdHlwZXMnO1xuXG5jb25zdCBDVVNUT01fT1BTOiB7W2tleTogc3RyaW5nXTogT3BNYXBwZXJ9ID0ge307XG5cbi8qKlxuICogUmVnaXN0ZXIgYW4gT3AgZm9yIGdyYXBoIG1vZGVsIGV4ZWN1dG9yLiBUaGlzIGFsbG93cyB5b3UgdG8gcmVnaXN0ZXJcbiAqIFRlbnNvckZsb3cgY3VzdG9tIG9wIG9yIG92ZXJyaWRlIGV4aXN0aW5nIG9wLlxuICpcbiAqIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiByZWdpc3RlcmluZyBhIG5ldyBNYXRNdWwgT3AuXG4gKiBgYGBqc1xuICogY29uc3QgY3VzdG9tTWF0bXVsID0gKG5vZGUpID0+XG4gKiAgICB0Zi5tYXRNdWwoXG4gKiAgICAgICAgbm9kZS5pbnB1dHNbMF0sIG5vZGUuaW5wdXRzWzFdLFxuICogICAgICAgIG5vZGUuYXR0cnNbJ3RyYW5zcG9zZV9hJ10sIG5vZGUuYXR0cnNbJ3RyYW5zcG9zZV9iJ10pO1xuICpcbiAqIHRmLnJlZ2lzdGVyT3AoJ01hdE11bCcsIGN1c3RvbU1hdG11bCk7XG4gKiBgYGBcbiAqIFRoZSBpbnB1dHMgYW5kIGF0dHJzIG9mIHRoZSBub2RlIG9iamVjdCBhcmUgYmFzZWQgb24gdGhlIFRlbnNvckZsb3cgb3BcbiAqIHJlZ2lzdHJ5LlxuICpcbiAqIEBwYXJhbSBuYW1lIFRoZSBUZW5zb3JmbG93IE9wIG5hbWUuXG4gKiBAcGFyYW0gb3BGdW5jIEFuIG9wIGZ1bmN0aW9uIHdoaWNoIGlzIGNhbGxlZCB3aXRoIHRoZSBjdXJyZW50IGdyYXBoIG5vZGVcbiAqIGR1cmluZyBleGVjdXRpb24gYW5kIG5lZWRzIHRvIHJldHVybiBhIHRlbnNvciBvciBhIGxpc3Qgb2YgdGVuc29ycy4gVGhlIG5vZGVcbiAqIGhhcyB0aGUgZm9sbG93aW5nIGF0dHJpYnV0ZXM6XG4gKiAgICAtIGF0dHI6IEEgbWFwIGZyb20gYXR0cmlidXRlIG5hbWUgdG8gaXRzIHZhbHVlXG4gKiAgICAtIGlucHV0czogQSBsaXN0IG9mIGlucHV0IHRlbnNvcnNcbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnTW9kZWxzJywgc3ViaGVhZGluZzogJ09wIFJlZ2lzdHJ5J31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyT3AobmFtZTogc3RyaW5nLCBvcEZ1bmM6IE9wRXhlY3V0b3IpIHtcbiAgY29uc3Qgb3BNYXBwZXI6IE9wTWFwcGVyID0ge1xuICAgIHRmT3BOYW1lOiBuYW1lLFxuICAgIGNhdGVnb3J5OiAnY3VzdG9tJyxcbiAgICBpbnB1dHM6IFtdLFxuICAgIGF0dHJzOiBbXSxcbiAgICBjdXN0b21FeGVjdXRvcjogb3BGdW5jXG4gIH07XG5cbiAgQ1VTVE9NX09QU1tuYW1lXSA9IG9wTWFwcGVyO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBPcE1hcHBlciBvYmplY3QgZm9yIHRoZSByZWdpc3RlcmVkIG9wLlxuICpcbiAqIEBwYXJhbSBuYW1lIFRoZSBUZW5zb3JmbG93IE9wIG5hbWUuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ01vZGVscycsIHN1YmhlYWRpbmc6ICdPcCBSZWdpc3RyeSd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWdpc3RlcmVkT3AobmFtZTogc3RyaW5nKTogT3BNYXBwZXIge1xuICByZXR1cm4gQ1VTVE9NX09QU1tuYW1lXTtcbn1cblxuLyoqXG4gKiBEZXJlZ2lzdGVyIHRoZSBPcCBmb3IgZ3JhcGggbW9kZWwgZXhlY3V0b3IuXG4gKlxuICogQHBhcmFtIG5hbWUgVGhlIFRlbnNvcmZsb3cgT3AgbmFtZS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnTW9kZWxzJywgc3ViaGVhZGluZzogJ09wIFJlZ2lzdHJ5J31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcmVnaXN0ZXJPcChuYW1lOiBzdHJpbmcpIHtcbiAgZGVsZXRlIENVU1RPTV9PUFNbbmFtZV07XG59XG4iXX0=