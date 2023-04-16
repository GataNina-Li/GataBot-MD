import { concat } from './concat';
import { op } from './operation';
/**
 * Concatenates a list of `tf.Tensor3D`s along an axis.
 * See `concat` for details.
 *
 * For example, if:
 * A: shape(2, 1, 3) = | r1, g1, b1 |
 *                     | r2, g2, b2 |
 *
 * B: shape(2, 1, 3) = | r3, g3, b3 |
 *                     | r4, g4, b4 |
 *
 * C = tf.concat3d([A, B], axis)
 *
 * if axis = 0:
 * C: shape(4, 1, 3) = | r1, g1, b1 |
 *                     | r2, g2, b2 |
 *                     | r3, g3, b3 |
 *                     | r4, g4, b4 |
 *
 * if axis = 1:
 * C: shape(2, 2, 3) = | r1, g1, b1, r3, g3, b3 |
 *                     | r2, g2, b2, r4, g4, b4 |
 *
 * if axis = 2:
 * C = shape(2, 1, 6) = | r1, g1, b1, r3, g3, b3 |
 *                      | r2, g2, b2, r4, g4, b4 |
 *
 * @param tensors A list of`tf.Tensor`s to concatenate.
 * @param axis The axis to concate along.
 * @return The concatenated array.
 */
function concat3d_(tensors, axis) {
    return concat(tensors, axis);
}
export const concat3d = op({ concat3d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0XzNkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvY29uY2F0XzNkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1CQSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCRztBQUNILFNBQVMsU0FBUyxDQUNkLE9BQW1DLEVBQUUsSUFBWTtJQUNuRCxPQUFPLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtUZW5zb3IzRH0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge2NvbmNhdH0gZnJvbSAnLi9jb25jYXQnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIENvbmNhdGVuYXRlcyBhIGxpc3Qgb2YgYHRmLlRlbnNvcjNEYHMgYWxvbmcgYW4gYXhpcy5cbiAqIFNlZSBgY29uY2F0YCBmb3IgZGV0YWlscy5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgaWY6XG4gKiBBOiBzaGFwZSgyLCAxLCAzKSA9IHwgcjEsIGcxLCBiMSB8XG4gKiAgICAgICAgICAgICAgICAgICAgIHwgcjIsIGcyLCBiMiB8XG4gKlxuICogQjogc2hhcGUoMiwgMSwgMykgPSB8IHIzLCBnMywgYjMgfFxuICogICAgICAgICAgICAgICAgICAgICB8IHI0LCBnNCwgYjQgfFxuICpcbiAqIEMgPSB0Zi5jb25jYXQzZChbQSwgQl0sIGF4aXMpXG4gKlxuICogaWYgYXhpcyA9IDA6XG4gKiBDOiBzaGFwZSg0LCAxLCAzKSA9IHwgcjEsIGcxLCBiMSB8XG4gKiAgICAgICAgICAgICAgICAgICAgIHwgcjIsIGcyLCBiMiB8XG4gKiAgICAgICAgICAgICAgICAgICAgIHwgcjMsIGczLCBiMyB8XG4gKiAgICAgICAgICAgICAgICAgICAgIHwgcjQsIGc0LCBiNCB8XG4gKlxuICogaWYgYXhpcyA9IDE6XG4gKiBDOiBzaGFwZSgyLCAyLCAzKSA9IHwgcjEsIGcxLCBiMSwgcjMsIGczLCBiMyB8XG4gKiAgICAgICAgICAgICAgICAgICAgIHwgcjIsIGcyLCBiMiwgcjQsIGc0LCBiNCB8XG4gKlxuICogaWYgYXhpcyA9IDI6XG4gKiBDID0gc2hhcGUoMiwgMSwgNikgPSB8IHIxLCBnMSwgYjEsIHIzLCBnMywgYjMgfFxuICogICAgICAgICAgICAgICAgICAgICAgfCByMiwgZzIsIGIyLCByNCwgZzQsIGI0IHxcbiAqXG4gKiBAcGFyYW0gdGVuc29ycyBBIGxpc3Qgb2ZgdGYuVGVuc29yYHMgdG8gY29uY2F0ZW5hdGUuXG4gKiBAcGFyYW0gYXhpcyBUaGUgYXhpcyB0byBjb25jYXRlIGFsb25nLlxuICogQHJldHVybiBUaGUgY29uY2F0ZW5hdGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjb25jYXQzZF8oXG4gICAgdGVuc29yczogQXJyYXk8VGVuc29yM0R8VGVuc29yTGlrZT4sIGF4aXM6IG51bWJlcik6IFRlbnNvcjNEIHtcbiAgcmV0dXJuIGNvbmNhdCh0ZW5zb3JzLCBheGlzKTtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbmNhdDNkID0gb3Aoe2NvbmNhdDNkX30pO1xuIl19