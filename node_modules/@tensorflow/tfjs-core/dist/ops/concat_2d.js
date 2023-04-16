import { concat } from './concat';
import { op } from './operation';
/**
 * Concatenates a list of`tf.Tensor2D`s along an axis. See `concat` for details.
 *
 * For example, if:
 * A: shape(2, 3) = | r1, g1, b1 |
 *                  | r2, g2, b2 |
 *
 * B: shape(2, 3) = | r3, g3, b3 |
 *                  | r4, g4, b4 |
 *
 * C = tf.concat2d([A, B], axis)
 *
 * if axis = 0:
 * C: shape(4, 3) = | r1, g1, b1 |
 *                  | r2, g2, b2 |
 *                  | r3, g3, b3 |
 *                  | r4, g4, b4 |
 *
 * if axis = 1:
 * C = shape(2, 6) = | r1, g1, b1, r3, g3, b3 |
 *                   | r2, g2, b2, r4, g4, b4 |
 *
 *
 * @param tensors A list of `tf.Tensor`s to concatenate.
 * @param axis The axis to concatenate along.
 * @return The concatenated array.
 */
function concat2d_(tensors, axis) {
    return concat(tensors, axis);
}
export const concat2d = op({ concat2d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0XzJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvY29uY2F0XzJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1CQSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJHO0FBQ0gsU0FBUyxTQUFTLENBQ2QsT0FBbUMsRUFBRSxJQUFZO0lBQ25ELE9BQU8sTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFDLFNBQVMsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge1RlbnNvcjJEfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7Y29uY2F0fSBmcm9tICcuL2NvbmNhdCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogQ29uY2F0ZW5hdGVzIGEgbGlzdCBvZmB0Zi5UZW5zb3IyRGBzIGFsb25nIGFuIGF4aXMuIFNlZSBgY29uY2F0YCBmb3IgZGV0YWlscy5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgaWY6XG4gKiBBOiBzaGFwZSgyLCAzKSA9IHwgcjEsIGcxLCBiMSB8XG4gKiAgICAgICAgICAgICAgICAgIHwgcjIsIGcyLCBiMiB8XG4gKlxuICogQjogc2hhcGUoMiwgMykgPSB8IHIzLCBnMywgYjMgfFxuICogICAgICAgICAgICAgICAgICB8IHI0LCBnNCwgYjQgfFxuICpcbiAqIEMgPSB0Zi5jb25jYXQyZChbQSwgQl0sIGF4aXMpXG4gKlxuICogaWYgYXhpcyA9IDA6XG4gKiBDOiBzaGFwZSg0LCAzKSA9IHwgcjEsIGcxLCBiMSB8XG4gKiAgICAgICAgICAgICAgICAgIHwgcjIsIGcyLCBiMiB8XG4gKiAgICAgICAgICAgICAgICAgIHwgcjMsIGczLCBiMyB8XG4gKiAgICAgICAgICAgICAgICAgIHwgcjQsIGc0LCBiNCB8XG4gKlxuICogaWYgYXhpcyA9IDE6XG4gKiBDID0gc2hhcGUoMiwgNikgPSB8IHIxLCBnMSwgYjEsIHIzLCBnMywgYjMgfFxuICogICAgICAgICAgICAgICAgICAgfCByMiwgZzIsIGIyLCByNCwgZzQsIGI0IHxcbiAqXG4gKlxuICogQHBhcmFtIHRlbnNvcnMgQSBsaXN0IG9mIGB0Zi5UZW5zb3JgcyB0byBjb25jYXRlbmF0ZS5cbiAqIEBwYXJhbSBheGlzIFRoZSBheGlzIHRvIGNvbmNhdGVuYXRlIGFsb25nLlxuICogQHJldHVybiBUaGUgY29uY2F0ZW5hdGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjb25jYXQyZF8oXG4gICAgdGVuc29yczogQXJyYXk8VGVuc29yMkR8VGVuc29yTGlrZT4sIGF4aXM6IG51bWJlcik6IFRlbnNvcjJEIHtcbiAgcmV0dXJuIGNvbmNhdCh0ZW5zb3JzLCBheGlzKTtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbmNhdDJkID0gb3Aoe2NvbmNhdDJkX30pO1xuIl19