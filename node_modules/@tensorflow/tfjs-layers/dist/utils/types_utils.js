/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import { ValueError } from '../errors';
// tslint:enable
/**
 * Determine whether the input is an Array of Shapes.
 */
export function isArrayOfShapes(x) {
    return Array.isArray(x) && Array.isArray(x[0]);
}
/**
 * Special case of normalizing shapes to lists.
 *
 * @param x A shape or list of shapes to normalize into a list of Shapes.
 * @return A list of Shapes.
 */
export function normalizeShapeList(x) {
    if (x.length === 0) {
        return [];
    }
    if (!Array.isArray(x[0])) {
        return [x];
    }
    return x;
}
/**
 * Helper function to obtain exactly one Tensor.
 * @param xs: A single `tf.Tensor` or an `Array` of `tf.Tensor`s.
 * @return A single `tf.Tensor`. If `xs` is an `Array`, return the first one.
 * @throws ValueError: If `xs` is an `Array` and its length is not 1.
 */
export function getExactlyOneTensor(xs) {
    let x;
    if (Array.isArray(xs)) {
        if (xs.length !== 1) {
            throw new ValueError(`Expected Tensor length to be 1; got ${xs.length}`);
        }
        x = xs[0];
    }
    else {
        x = xs;
    }
    return x;
}
/**
 * Helper function to obtain exactly on instance of Shape.
 *
 * @param shapes Input single `Shape` or Array of `Shape`s.
 * @returns If input is a single `Shape`, return it unchanged. If the input is
 *   an `Array` containing exactly one instance of `Shape`, return the instance.
 *   Otherwise, throw a `ValueError`.
 * @throws ValueError: If input is an `Array` of `Shape`s, and its length is not
 *   1.
 */
export function getExactlyOneShape(shapes) {
    if (Array.isArray(shapes) && Array.isArray(shapes[0])) {
        if (shapes.length === 1) {
            shapes = shapes;
            return shapes[0];
        }
        else {
            throw new ValueError(`Expected exactly 1 Shape; got ${shapes.length}`);
        }
    }
    else {
        return shapes;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvdXRpbHMvdHlwZXNfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0dBUUc7QUFLSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRXJDLGdCQUFnQjtBQUVoQjs7R0FFRztBQUNILE1BQU0sVUFBVSxlQUFlLENBQUMsQ0FBZ0I7SUFDOUMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLENBQWdCO0lBQ2pELElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDbEIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3hCLE9BQU8sQ0FBQyxDQUFDLENBQVksQ0FBQztLQUN2QjtJQUNELE9BQU8sQ0FBWSxDQUFDO0FBQ3RCLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxFQUFtQjtJQUNyRCxJQUFJLENBQVMsQ0FBQztJQUNkLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNyQixJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ25CLE1BQU0sSUFBSSxVQUFVLENBQUMsdUNBQXVDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQzFFO1FBQ0QsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNYO1NBQU07UUFDTCxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ1I7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsTUFBcUI7SUFDdEQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDckQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN2QixNQUFNLEdBQUcsTUFBaUIsQ0FBQztZQUMzQixPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQjthQUFNO1lBQ0wsTUFBTSxJQUFJLFVBQVUsQ0FBQyxpQ0FBaUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDeEU7S0FDRjtTQUFNO1FBQ0wsT0FBTyxNQUFlLENBQUM7S0FDeEI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyogT3JpZ2luYWwgc291cmNlOiB1dGlscy9nZW5lcmljX3V0aWxzLnB5ICovXG5cbmltcG9ydCB7VGVuc29yfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtWYWx1ZUVycm9yfSBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IHtTaGFwZX0gZnJvbSAnLi4va2VyYXNfZm9ybWF0L2NvbW1vbic7XG4vLyB0c2xpbnQ6ZW5hYmxlXG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGlucHV0IGlzIGFuIEFycmF5IG9mIFNoYXBlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlPZlNoYXBlcyh4OiBTaGFwZXxTaGFwZVtdKTogYm9vbGVhbiB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHgpICYmIEFycmF5LmlzQXJyYXkoeFswXSk7XG59XG5cbi8qKlxuICogU3BlY2lhbCBjYXNlIG9mIG5vcm1hbGl6aW5nIHNoYXBlcyB0byBsaXN0cy5cbiAqXG4gKiBAcGFyYW0geCBBIHNoYXBlIG9yIGxpc3Qgb2Ygc2hhcGVzIHRvIG5vcm1hbGl6ZSBpbnRvIGEgbGlzdCBvZiBTaGFwZXMuXG4gKiBAcmV0dXJuIEEgbGlzdCBvZiBTaGFwZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVTaGFwZUxpc3QoeDogU2hhcGV8U2hhcGVbXSk6IFNoYXBlW10ge1xuICBpZiAoeC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKCFBcnJheS5pc0FycmF5KHhbMF0pKSB7XG4gICAgcmV0dXJuIFt4XSBhcyBTaGFwZVtdO1xuICB9XG4gIHJldHVybiB4IGFzIFNoYXBlW107XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIG9idGFpbiBleGFjdGx5IG9uZSBUZW5zb3IuXG4gKiBAcGFyYW0geHM6IEEgc2luZ2xlIGB0Zi5UZW5zb3JgIG9yIGFuIGBBcnJheWAgb2YgYHRmLlRlbnNvcmBzLlxuICogQHJldHVybiBBIHNpbmdsZSBgdGYuVGVuc29yYC4gSWYgYHhzYCBpcyBhbiBgQXJyYXlgLCByZXR1cm4gdGhlIGZpcnN0IG9uZS5cbiAqIEB0aHJvd3MgVmFsdWVFcnJvcjogSWYgYHhzYCBpcyBhbiBgQXJyYXlgIGFuZCBpdHMgbGVuZ3RoIGlzIG5vdCAxLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXhhY3RseU9uZVRlbnNvcih4czogVGVuc29yfFRlbnNvcltdKTogVGVuc29yIHtcbiAgbGV0IHg6IFRlbnNvcjtcbiAgaWYgKEFycmF5LmlzQXJyYXkoeHMpKSB7XG4gICAgaWYgKHhzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoYEV4cGVjdGVkIFRlbnNvciBsZW5ndGggdG8gYmUgMTsgZ290ICR7eHMubGVuZ3RofWApO1xuICAgIH1cbiAgICB4ID0geHNbMF07XG4gIH0gZWxzZSB7XG4gICAgeCA9IHhzO1xuICB9XG4gIHJldHVybiB4O1xufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBvYnRhaW4gZXhhY3RseSBvbiBpbnN0YW5jZSBvZiBTaGFwZS5cbiAqXG4gKiBAcGFyYW0gc2hhcGVzIElucHV0IHNpbmdsZSBgU2hhcGVgIG9yIEFycmF5IG9mIGBTaGFwZWBzLlxuICogQHJldHVybnMgSWYgaW5wdXQgaXMgYSBzaW5nbGUgYFNoYXBlYCwgcmV0dXJuIGl0IHVuY2hhbmdlZC4gSWYgdGhlIGlucHV0IGlzXG4gKiAgIGFuIGBBcnJheWAgY29udGFpbmluZyBleGFjdGx5IG9uZSBpbnN0YW5jZSBvZiBgU2hhcGVgLCByZXR1cm4gdGhlIGluc3RhbmNlLlxuICogICBPdGhlcndpc2UsIHRocm93IGEgYFZhbHVlRXJyb3JgLlxuICogQHRocm93cyBWYWx1ZUVycm9yOiBJZiBpbnB1dCBpcyBhbiBgQXJyYXlgIG9mIGBTaGFwZWBzLCBhbmQgaXRzIGxlbmd0aCBpcyBub3RcbiAqICAgMS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEV4YWN0bHlPbmVTaGFwZShzaGFwZXM6IFNoYXBlfFNoYXBlW10pOiBTaGFwZSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHNoYXBlcykgJiYgQXJyYXkuaXNBcnJheShzaGFwZXNbMF0pKSB7XG4gICAgaWYgKHNoYXBlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHNoYXBlcyA9IHNoYXBlcyBhcyBTaGFwZVtdO1xuICAgICAgcmV0dXJuIHNoYXBlc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoYEV4cGVjdGVkIGV4YWN0bHkgMSBTaGFwZTsgZ290ICR7c2hhcGVzLmxlbmd0aH1gKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHNoYXBlcyBhcyBTaGFwZTtcbiAgfVxufVxuIl19