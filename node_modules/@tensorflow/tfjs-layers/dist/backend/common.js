/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import { backend } from '@tensorflow/tfjs-core';
let _epsilon;
/**
 * Returns the value of the fuzz factor used in numeric expressions.
 */
export function epsilon() {
    if (_epsilon == null) {
        _epsilon = backend().epsilon();
    }
    return _epsilon;
}
/**
 * Sets the value of the fuzz factor used in numeric expressions.
 * @param e New value of epsilon.
 */
export function setEpsilon(e) {
    _epsilon = e;
}
/**
 * Returns the default image data format convention.
 */
export function imageDataFormat() {
    return 'channelsLast';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1sYXllcnMvc3JjL2JhY2tlbmQvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRzlDLElBQUksUUFBZ0IsQ0FBQztBQUVyQjs7R0FFRztBQUNILE1BQU0sVUFBVSxPQUFPO0lBQ3JCLElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtRQUNwQixRQUFRLEdBQUcsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDaEM7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBQyxDQUFTO0lBQ2xDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDZixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsZUFBZTtJQUM3QixPQUFPLGNBQWMsQ0FBQztBQUN4QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtEYXRhRm9ybWF0fSBmcm9tICcuLi9rZXJhc19mb3JtYXQvY29tbW9uJztcblxubGV0IF9lcHNpbG9uOiBudW1iZXI7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGZ1enogZmFjdG9yIHVzZWQgaW4gbnVtZXJpYyBleHByZXNzaW9ucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVwc2lsb24oKSB7XG4gIGlmIChfZXBzaWxvbiA9PSBudWxsKSB7XG4gICAgX2Vwc2lsb24gPSBiYWNrZW5kKCkuZXBzaWxvbigpO1xuICB9XG4gIHJldHVybiBfZXBzaWxvbjtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgZnV6eiBmYWN0b3IgdXNlZCBpbiBudW1lcmljIGV4cHJlc3Npb25zLlxuICogQHBhcmFtIGUgTmV3IHZhbHVlIG9mIGVwc2lsb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRFcHNpbG9uKGU6IG51bWJlcikge1xuICBfZXBzaWxvbiA9IGU7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZGVmYXVsdCBpbWFnZSBkYXRhIGZvcm1hdCBjb252ZW50aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW1hZ2VEYXRhRm9ybWF0KCk6IERhdGFGb3JtYXQge1xuICByZXR1cm4gJ2NoYW5uZWxzTGFzdCc7XG59XG4iXX0=