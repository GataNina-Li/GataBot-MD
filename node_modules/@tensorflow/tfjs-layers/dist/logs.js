/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import { dispose } from '@tensorflow/tfjs-core';
/**
 * Turn any Scalar values in a Logs object into actual number values.
 *
 * @param logs The `Logs` object to be resolved in place.
 */
export async function resolveScalarsInLogs(logs) {
    if (logs == null) {
        return;
    }
    const promises = [];
    const keys = [];
    const scalarsToDispose = [];
    for (const key in logs) {
        const value = logs[key];
        if (typeof value !== 'number') {
            const valueScalar = value;
            promises.push(valueScalar.data());
            keys.push(key);
            scalarsToDispose.push(valueScalar);
        }
    }
    if (promises.length > 0) {
        const values = await Promise.all(promises);
        for (let i = 0; i < values.length; ++i) {
            logs[keys[i]] = values[i][0];
        }
        // Dispose the original scalar tensors.
        dispose(scalarsToDispose);
    }
}
/**
 * Dispose all Tensors in an UnresolvedLogs object.
 *
 * @param logs An `UnresolvedLogs` object potentially containing `tf.Tensor`s in
 *   places where the values can be `tf.Tensor` or `number`.
 */
export function disposeTensorsInLogs(logs) {
    if (logs == null) {
        return;
    }
    for (const key in logs) {
        const value = logs[key];
        if (typeof value !== 'number') {
            value.dispose();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtbGF5ZXJzL3NyYy9sb2dzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBUyxNQUFNLHVCQUF1QixDQUFDO0FBV3REOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLG9CQUFvQixDQUFDLElBQW9CO0lBQzdELElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtRQUNoQixPQUFPO0tBQ1I7SUFDRCxNQUFNLFFBQVEsR0FBdUQsRUFBRSxDQUFDO0lBQ3hFLE1BQU0sSUFBSSxHQUFhLEVBQUUsQ0FBQztJQUMxQixNQUFNLGdCQUFnQixHQUFhLEVBQUUsQ0FBQztJQUN0QyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtRQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNmLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNwQztLQUNGO0lBQ0QsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN2QixNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5QjtRQUNELHVDQUF1QztRQUN2QyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUMzQjtBQUNILENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxJQUFvQjtJQUN2RCxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7UUFDaEIsT0FBTztLQUNSO0lBQ0QsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNqQjtLQUNGO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAqIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7ZGlzcG9zZSwgU2NhbGFyfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG4vKipcbiAqIExvZ3MgaW4gd2hpY2ggdmFsdWVzIGNhbiBiZSBlaXRoZXIgbnVtYmVycyBvciBUZW5zb3JzIChTY2FsYXJzKS5cbiAqXG4gKiBVc2VkIGludGVybmFsbHkuXG4gKi9cbmV4cG9ydCB0eXBlIFVucmVzb2x2ZWRMb2dzID0ge1xuICBba2V5OiBzdHJpbmddOiBudW1iZXJ8U2NhbGFyO1xufTtcblxuLyoqXG4gKiBUdXJuIGFueSBTY2FsYXIgdmFsdWVzIGluIGEgTG9ncyBvYmplY3QgaW50byBhY3R1YWwgbnVtYmVyIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0gbG9ncyBUaGUgYExvZ3NgIG9iamVjdCB0byBiZSByZXNvbHZlZCBpbiBwbGFjZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc29sdmVTY2FsYXJzSW5Mb2dzKGxvZ3M6IFVucmVzb2x2ZWRMb2dzKSB7XG4gIGlmIChsb2dzID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgcHJvbWlzZXM6IEFycmF5PFByb21pc2U8RmxvYXQzMkFycmF5fEludDMyQXJyYXl8VWludDhBcnJheT4+ID0gW107XG4gIGNvbnN0IGtleXM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHNjYWxhcnNUb0Rpc3Bvc2U6IFNjYWxhcltdID0gW107XG4gIGZvciAoY29uc3Qga2V5IGluIGxvZ3MpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGxvZ3Nba2V5XTtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgY29uc3QgdmFsdWVTY2FsYXIgPSB2YWx1ZTtcbiAgICAgIHByb21pc2VzLnB1c2godmFsdWVTY2FsYXIuZGF0YSgpKTtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgc2NhbGFyc1RvRGlzcG9zZS5wdXNoKHZhbHVlU2NhbGFyKTtcbiAgICB9XG4gIH1cbiAgaWYgKHByb21pc2VzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxvZ3Nba2V5c1tpXV0gPSB2YWx1ZXNbaV1bMF07XG4gICAgfVxuICAgIC8vIERpc3Bvc2UgdGhlIG9yaWdpbmFsIHNjYWxhciB0ZW5zb3JzLlxuICAgIGRpc3Bvc2Uoc2NhbGFyc1RvRGlzcG9zZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwb3NlIGFsbCBUZW5zb3JzIGluIGFuIFVucmVzb2x2ZWRMb2dzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gbG9ncyBBbiBgVW5yZXNvbHZlZExvZ3NgIG9iamVjdCBwb3RlbnRpYWxseSBjb250YWluaW5nIGB0Zi5UZW5zb3JgcyBpblxuICogICBwbGFjZXMgd2hlcmUgdGhlIHZhbHVlcyBjYW4gYmUgYHRmLlRlbnNvcmAgb3IgYG51bWJlcmAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXNwb3NlVGVuc29yc0luTG9ncyhsb2dzOiBVbnJlc29sdmVkTG9ncykge1xuICBpZiAobG9ncyA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IGluIGxvZ3MpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGxvZ3Nba2V5XTtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgdmFsdWUuZGlzcG9zZSgpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIExvZ3MgaW4gd2hpY2ggdmFsdWVzIGNhbiBvbmx5IGJlIG51bWJlcnMuXG4gKlxuICogVXNlZCB3aGVuIGNhbGxpbmcgY2xpZW50LXByb3ZpZGVkIGN1c3RvbSBjYWxsYmFja3MuXG4gKi9cbmV4cG9ydCB0eXBlIExvZ3MgPSB7XG4gIFtrZXk6IHN0cmluZ106IG51bWJlcjtcbn07XG4iXX0=