/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
import { reshape } from '../../ops/reshape';
import { getGlobalTensorClass } from '../../tensor';
/**
 * Converts a `tf.Tensor` to a `tf.Tensor5D`.
 *
 * @param rows Number of rows in `tf.Tensor5D`.
 * @param columns Number of columns in `tf.Tensor5D`.
 * @param depth Depth of `tf.Tensor5D`.
 * @param depth2 4th dimension of `tf.Tensor5D`.
 * @param depth3 5th dimension of 'tf.Tensor5D'
 *
 * @doc {heading: 'Tensors', subheading: 'Classes'}
 */
getGlobalTensorClass().prototype.as5D = function (rows, columns, depth, depth2, depth3) {
    this.throwIfDisposed();
    return reshape(this, [rows, columns, depth, depth2, depth3]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXM1ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvcHVibGljL2NoYWluZWRfb3BzL2FzNWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxvQkFBb0IsRUFBUyxNQUFNLGNBQWMsQ0FBQztBQVcxRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsb0JBQW9CLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQ3BDLElBQVksRUFBRSxPQUFlLEVBQUUsS0FBYSxFQUFFLE1BQWMsRUFDNUQsTUFBYztJQUNoQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDdkIsT0FBTyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFNLENBQUM7QUFDcEUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4uLy4uL29wcy9yZXNoYXBlJztcbmltcG9ydCB7Z2V0R2xvYmFsVGVuc29yQ2xhc3MsIFRlbnNvcn0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7UmFua30gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5kZWNsYXJlIG1vZHVsZSAnLi4vLi4vdGVuc29yJyB7XG4gIGludGVyZmFjZSBUZW5zb3I8UiBleHRlbmRzIFJhbmsgPSBSYW5rPiB7XG4gICAgYXM1RDxUIGV4dGVuZHMgVGVuc29yPihcbiAgICAgICAgcm93czogbnVtYmVyLCBjb2x1bW5zOiBudW1iZXIsIGRlcHRoOiBudW1iZXIsIGRlcHRoMjogbnVtYmVyLFxuICAgICAgICBkZXB0aDM6IG51bWJlcik6IFRlbnNvcjVEO1xuICB9XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBgdGYuVGVuc29yYCB0byBhIGB0Zi5UZW5zb3I1RGAuXG4gKlxuICogQHBhcmFtIHJvd3MgTnVtYmVyIG9mIHJvd3MgaW4gYHRmLlRlbnNvcjVEYC5cbiAqIEBwYXJhbSBjb2x1bW5zIE51bWJlciBvZiBjb2x1bW5zIGluIGB0Zi5UZW5zb3I1RGAuXG4gKiBAcGFyYW0gZGVwdGggRGVwdGggb2YgYHRmLlRlbnNvcjVEYC5cbiAqIEBwYXJhbSBkZXB0aDIgNHRoIGRpbWVuc2lvbiBvZiBgdGYuVGVuc29yNURgLlxuICogQHBhcmFtIGRlcHRoMyA1dGggZGltZW5zaW9uIG9mICd0Zi5UZW5zb3I1RCdcbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnVGVuc29ycycsIHN1YmhlYWRpbmc6ICdDbGFzc2VzJ31cbiAqL1xuZ2V0R2xvYmFsVGVuc29yQ2xhc3MoKS5wcm90b3R5cGUuYXM1RCA9IGZ1bmN0aW9uPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIHJvd3M6IG51bWJlciwgY29sdW1uczogbnVtYmVyLCBkZXB0aDogbnVtYmVyLCBkZXB0aDI6IG51bWJlcixcbiAgICBkZXB0aDM6IG51bWJlcik6IFQge1xuICB0aGlzLnRocm93SWZEaXNwb3NlZCgpO1xuICByZXR1cm4gcmVzaGFwZSh0aGlzLCBbcm93cywgY29sdW1ucywgZGVwdGgsIGRlcHRoMiwgZGVwdGgzXSkgYXMgVDtcbn07XG4iXX0=