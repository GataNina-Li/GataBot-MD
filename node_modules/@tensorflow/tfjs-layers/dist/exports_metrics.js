import * as losses from './losses';
import * as metrics from './metrics';
/**
 * Binary accuracy metric function.
 *
 * `yTrue` and `yPred` can have 0-1 values. Example:
 * ```js
 * const x = tf.tensor2d([[1, 1, 1, 1], [0, 0, 0, 0]], [2, 4]);
 * const y = tf.tensor2d([[1, 0, 1, 0], [0, 0, 0, 1]], [2, 4]);
 * const accuracy = tf.metrics.binaryAccuracy(x, y);
 * accuracy.print();
 * ```
 *
 * `yTrue` and `yPred` can also have floating-number values between 0 and 1, in
 * which case the values will be thresholded at 0.5 to yield 0-1 values (i.e.,
 * a value >= 0.5 and <= 1.0 is interpreted as 1).
 *
 * Example:
 * ```js
 * const x = tf.tensor1d([1, 1, 1, 1, 0, 0, 0, 0]);
 * const y = tf.tensor1d([0.2, 0.4, 0.6, 0.8, 0.2, 0.3, 0.4, 0.7]);
 * const accuracy = tf.metrics.binaryAccuracy(x, y);
 * accuracy.print();
 * ```
 *
 * @param yTrue Binary Tensor of truth.
 * @param yPred Binary Tensor of prediction.
 * @return Accuracy Tensor.
 *
 * @doc {heading: 'Metrics', namespace: 'metrics'}
 */
export function binaryAccuracy(yTrue, yPred) {
    return metrics.binaryAccuracy(yTrue, yPred);
}
/**
 * Binary crossentropy metric function.
 *
 * Example:
 * ```js
 * const x = tf.tensor2d([[0], [1], [1], [1]]);
 * const y = tf.tensor2d([[0], [0], [0.5], [1]]);
 * const crossentropy = tf.metrics.binaryCrossentropy(x, y);
 * crossentropy.print();
 * ```
 *
 * @param yTrue Binary Tensor of truth.
 * @param yPred Binary Tensor of prediction, probabilities for the `1` case.
 * @return Accuracy Tensor.
 *
 * @doc {heading: 'Metrics', namespace: 'metrics'}
 */
export function binaryCrossentropy(yTrue, yPred) {
    return metrics.binaryCrossentropy(yTrue, yPred);
}
/**
 * Sparse categorical accuracy metric function.
 *
 * Example:
 * ```js
 *
 * const yTrue = tf.tensor1d([1, 1, 2, 2, 0]);
 * const yPred = tf.tensor2d(
 *      [[0, 1, 0], [1, 0, 0], [0, 0.4, 0.6], [0, 0.6, 0.4], [0.7, 0.3, 0]]);
 * const crossentropy = tf.metrics.sparseCategoricalAccuracy(yTrue, yPred);
 * crossentropy.print();
 * ```
 *
 * @param yTrue True labels: indices.
 * @param yPred Predicted probabilities or logits.
 * @returns Accuracy tensor.
 *
 * @doc {heading: 'Metrics', namespace: 'metrics'}
 */
export function sparseCategoricalAccuracy(yTrue, yPred) {
    return metrics.sparseCategoricalAccuracy(yTrue, yPred);
}
/**
 * Categorical accuracy metric function.
 *
 * Example:
 * ```js
 * const x = tf.tensor2d([[0, 0, 0, 1], [0, 0, 0, 1]]);
 * const y = tf.tensor2d([[0.1, 0.8, 0.05, 0.05], [0.1, 0.05, 0.05, 0.8]]);
 * const accuracy = tf.metrics.categoricalAccuracy(x, y);
 * accuracy.print();
 * ```
 *
 * @param yTrue Binary Tensor of truth: one-hot encoding of categories.
 * @param yPred Binary Tensor of prediction: probabilities or logits for the
 *   same categories as in `yTrue`.
 * @return Accuracy Tensor.
 *
 * @doc {heading: 'Metrics', namespace: 'metrics'}
 */
export function categoricalAccuracy(yTrue, yPred) {
    return metrics.categoricalAccuracy(yTrue, yPred);
}
/**
 * Categorical crossentropy between an output tensor and a target tensor.
 *
 * @param target A tensor of the same shape as `output`.
 * @param output A tensor resulting from a softmax (unless `fromLogits` is
 *  `true`, in which case `output` is expected to be the logits).
 * @param fromLogits Boolean, whether `output` is the result of a softmax, or is
 *   a tensor of logits.
 *
 * @doc {heading: 'Metrics', namespace: 'metrics'}
 */
export function categoricalCrossentropy(yTrue, yPred) {
    return metrics.categoricalCrossentropy(yTrue, yPred);
}
/**
 * Computes the precision of the predictions with respect to the labels.
 *
 * Example:
 * ```js
 * const x = tf.tensor2d(
 *    [
 *      [0, 0, 0, 1],
 *      [0, 1, 0, 0],
 *      [0, 0, 0, 1],
 *      [1, 0, 0, 0],
 *      [0, 0, 1, 0]
 *    ]
 * );
 *
 * const y = tf.tensor2d(
 *    [
 *      [0, 0, 1, 0],
 *      [0, 1, 0, 0],
 *      [0, 0, 0, 1],
 *      [0, 1, 0, 0],
 *      [0, 1, 0, 0]
 *    ]
 * );
 *
 * const precision = tf.metrics.precision(x, y);
 * precision.print();
 * ```
 *
 * @param yTrue The ground truth values. Expected to contain only 0-1 values.
 * @param yPred The predicted values. Expected to contain only 0-1 values.
 * @return Precision Tensor.
 *
 * @doc {heading: 'Metrics', namespace: 'metrics'}
 */
export function precision(yTrue, yPred) {
    return metrics.precision(yTrue, yPred);
}
/**
 * Computes the recall of the predictions with respect to the labels.
 *
 * Example:
 * ```js
 * const x = tf.tensor2d(
 *    [
 *      [0, 0, 0, 1],
 *      [0, 1, 0, 0],
 *      [0, 0, 0, 1],
 *      [1, 0, 0, 0],
 *      [0, 0, 1, 0]
 *    ]
 * );
 *
 * const y = tf.tensor2d(
 *    [
 *      [0, 0, 1, 0],
 *      [0, 1, 0, 0],
 *      [0, 0, 0, 1],
 *      [0, 1, 0, 0],
 *      [0, 1, 0, 0]
 *    ]
 * );
 *
 * const recall = tf.metrics.recall(x, y);
 * recall.print();
 * ```
 *
 * @param yTrue The ground truth values. Expected to contain only 0-1 values.
 * @param yPred The predicted values. Expected to contain only 0-1 values.
 * @return Recall Tensor.
 *
 * @doc {heading: 'Metrics', namespace: 'metrics'}
 */
export function recall(yTrue, yPred) {
    return metrics.recall(yTrue, yPred);
}
/**
 * Loss or metric function: Cosine proximity.
 *
 * Mathematically, cosine proximity is defined as:
 *   `-sum(l2Normalize(yTrue) * l2Normalize(yPred))`,
 * wherein `l2Normalize()` normalizes the L2 norm of the input to 1 and `*`
 * represents element-wise multiplication.
 *
 * ```js
 * const yTrue = tf.tensor2d([[1, 0], [1, 0]]);
 * const yPred = tf.tensor2d([[1 / Math.sqrt(2), 1 / Math.sqrt(2)], [0, 1]]);
 * const proximity = tf.metrics.cosineProximity(yTrue, yPred);
 * proximity.print();
 * ```
 *
 * @param yTrue Truth Tensor.
 * @param yPred Prediction Tensor.
 * @return Cosine proximity Tensor.
 *
 * @doc {heading: 'Metrics', namespace: 'metrics'}
 */
export function cosineProximity(yTrue, yPred) {
    return losses.cosineProximity(yTrue, yPred);
}
/**
 * Loss or metric function: Mean absolute error.
 *
 * Mathematically, mean absolute error is defined as:
 *   `mean(abs(yPred - yTrue))`,
 * wherein the `mean` is applied over feature dimensions.
 *
 * ```js
 * const yTrue = tf.tensor2d([[0, 1], [0, 0], [2, 3]]);
 * const yPred = tf.tensor2d([[0, 1], [0, 1], [-2, -3]]);
 * const mse = tf.metrics.meanAbsoluteError(yTrue, yPred);
 * mse.print();
 * ```
 *
 * @param yTrue Truth Tensor.
 * @param yPred Prediction Tensor.
 * @return Mean absolute error Tensor.
 *
 * @doc {heading: 'Metrics', namespace: 'metrics'}
 */
export function meanAbsoluteError(yTrue, yPred) {
    return losses.meanAbsoluteError(yTrue, yPred);
}
/**
 * Loss or metric function: Mean absolute percentage error.
 *
 * ```js
 * const yTrue = tf.tensor2d([[0, 1], [10, 20]]);
 * const yPred = tf.tensor2d([[0, 1], [11, 24]]);
 * const mse = tf.metrics.meanAbsolutePercentageError(yTrue, yPred);
 * mse.print();
 * ```
 *
 * Aliases: `tf.metrics.MAPE`, `tf.metrics.mape`.
 *
 * @param yTrue Truth Tensor.
 * @param yPred Prediction Tensor.
 * @return Mean absolute percentage error Tensor.
 *
 * @doc {heading: 'Metrics', namespace: 'metrics'}
 */
export function meanAbsolutePercentageError(yTrue, yPred) {
    return losses.meanAbsolutePercentageError(yTrue, yPred);
}
export function MAPE(yTrue, yPred) {
    return losses.meanAbsolutePercentageError(yTrue, yPred);
}
export function mape(yTrue, yPred) {
    return losses.meanAbsolutePercentageError(yTrue, yPred);
}
/**
 * Loss or metric function: Mean squared error.
 *
 * ```js
 * const yTrue = tf.tensor2d([[0, 1], [3, 4]]);
 * const yPred = tf.tensor2d([[0, 1], [-3, -4]]);
 * const mse = tf.metrics.meanSquaredError(yTrue, yPred);
 * mse.print();
 * ```
 *
 * Aliases: `tf.metrics.MSE`, `tf.metrics.mse`.
 *
 * @param yTrue Truth Tensor.
 * @param yPred Prediction Tensor.
 * @return Mean squared error Tensor.
 *
 * @doc {heading: 'Metrics', namespace: 'metrics'}
 */
export function meanSquaredError(yTrue, yPred) {
    return losses.meanSquaredError(yTrue, yPred);
}
export function MSE(yTrue, yPred) {
    return losses.meanSquaredError(yTrue, yPred);
}
export function mse(yTrue, yPred) {
    return losses.meanSquaredError(yTrue, yPred);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0c19tZXRyaWNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1sYXllcnMvc3JjL2V4cG9ydHNfbWV0cmljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFXQSxPQUFPLEtBQUssTUFBTSxNQUFNLFVBQVUsQ0FBQztBQUNuQyxPQUFPLEtBQUssT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUVyQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQUMsS0FBYSxFQUFFLEtBQWE7SUFDekQsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsS0FBYSxFQUFFLEtBQWE7SUFDN0QsT0FBTyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsTUFBTSxVQUFVLHlCQUF5QixDQUNyQyxLQUFhLEVBQUUsS0FBYTtJQUM5QixPQUFPLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxLQUFhLEVBQUUsS0FBYTtJQUM5RCxPQUFPLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUVEOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLFVBQVUsdUJBQXVCLENBQUMsS0FBYSxFQUFFLEtBQWE7SUFDbEUsT0FBTyxPQUFPLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtDRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQUMsS0FBYSxFQUFFLEtBQWE7SUFDcEQsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQ0c7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUFDLEtBQWEsRUFBRSxLQUFhO0lBQ2pELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUNILE1BQU0sVUFBVSxlQUFlLENBQUMsS0FBYSxFQUFFLEtBQWE7SUFDMUQsT0FBTyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsS0FBYSxFQUFFLEtBQWE7SUFDNUQsT0FBTyxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxNQUFNLFVBQVUsMkJBQTJCLENBQ3ZDLEtBQWEsRUFBRSxLQUFhO0lBQzlCLE9BQU8sTUFBTSxDQUFDLDJCQUEyQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQsTUFBTSxVQUFVLElBQUksQ0FBQyxLQUFhLEVBQUUsS0FBYTtJQUMvQyxPQUFPLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUVELE1BQU0sVUFBVSxJQUFJLENBQUMsS0FBYSxFQUFFLEtBQWE7SUFDL0MsT0FBTyxNQUFNLENBQUMsMkJBQTJCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsS0FBYSxFQUFFLEtBQWE7SUFDM0QsT0FBTyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFFRCxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxLQUFhO0lBQzlDLE9BQU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRUQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFhLEVBQUUsS0FBYTtJQUM5QyxPQUFPLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0MsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAqIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0ICogYXMgbG9zc2VzIGZyb20gJy4vbG9zc2VzJztcbmltcG9ydCAqIGFzIG1ldHJpY3MgZnJvbSAnLi9tZXRyaWNzJztcblxuLyoqXG4gKiBCaW5hcnkgYWNjdXJhY3kgbWV0cmljIGZ1bmN0aW9uLlxuICpcbiAqIGB5VHJ1ZWAgYW5kIGB5UHJlZGAgY2FuIGhhdmUgMC0xIHZhbHVlcy4gRXhhbXBsZTpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMmQoW1sxLCAxLCAxLCAxXSwgWzAsIDAsIDAsIDBdXSwgWzIsIDRdKTtcbiAqIGNvbnN0IHkgPSB0Zi50ZW5zb3IyZChbWzEsIDAsIDEsIDBdLCBbMCwgMCwgMCwgMV1dLCBbMiwgNF0pO1xuICogY29uc3QgYWNjdXJhY3kgPSB0Zi5tZXRyaWNzLmJpbmFyeUFjY3VyYWN5KHgsIHkpO1xuICogYWNjdXJhY3kucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIGB5VHJ1ZWAgYW5kIGB5UHJlZGAgY2FuIGFsc28gaGF2ZSBmbG9hdGluZy1udW1iZXIgdmFsdWVzIGJldHdlZW4gMCBhbmQgMSwgaW5cbiAqIHdoaWNoIGNhc2UgdGhlIHZhbHVlcyB3aWxsIGJlIHRocmVzaG9sZGVkIGF0IDAuNSB0byB5aWVsZCAwLTEgdmFsdWVzIChpLmUuLFxuICogYSB2YWx1ZSA+PSAwLjUgYW5kIDw9IDEuMCBpcyBpbnRlcnByZXRlZCBhcyAxKS5cbiAqXG4gKiBFeGFtcGxlOlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMSwgMSwgMSwgMCwgMCwgMCwgMF0pO1xuICogY29uc3QgeSA9IHRmLnRlbnNvcjFkKFswLjIsIDAuNCwgMC42LCAwLjgsIDAuMiwgMC4zLCAwLjQsIDAuN10pO1xuICogY29uc3QgYWNjdXJhY3kgPSB0Zi5tZXRyaWNzLmJpbmFyeUFjY3VyYWN5KHgsIHkpO1xuICogYWNjdXJhY3kucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB5VHJ1ZSBCaW5hcnkgVGVuc29yIG9mIHRydXRoLlxuICogQHBhcmFtIHlQcmVkIEJpbmFyeSBUZW5zb3Igb2YgcHJlZGljdGlvbi5cbiAqIEByZXR1cm4gQWNjdXJhY3kgVGVuc29yLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdNZXRyaWNzJywgbmFtZXNwYWNlOiAnbWV0cmljcyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5hcnlBY2N1cmFjeSh5VHJ1ZTogVGVuc29yLCB5UHJlZDogVGVuc29yKTogVGVuc29yIHtcbiAgcmV0dXJuIG1ldHJpY3MuYmluYXJ5QWNjdXJhY3koeVRydWUsIHlQcmVkKTtcbn1cblxuLyoqXG4gKiBCaW5hcnkgY3Jvc3NlbnRyb3B5IG1ldHJpYyBmdW5jdGlvbi5cbiAqXG4gKiBFeGFtcGxlOlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IyZChbWzBdLCBbMV0sIFsxXSwgWzFdXSk7XG4gKiBjb25zdCB5ID0gdGYudGVuc29yMmQoW1swXSwgWzBdLCBbMC41XSwgWzFdXSk7XG4gKiBjb25zdCBjcm9zc2VudHJvcHkgPSB0Zi5tZXRyaWNzLmJpbmFyeUNyb3NzZW50cm9weSh4LCB5KTtcbiAqIGNyb3NzZW50cm9weS5wcmludCgpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHlUcnVlIEJpbmFyeSBUZW5zb3Igb2YgdHJ1dGguXG4gKiBAcGFyYW0geVByZWQgQmluYXJ5IFRlbnNvciBvZiBwcmVkaWN0aW9uLCBwcm9iYWJpbGl0aWVzIGZvciB0aGUgYDFgIGNhc2UuXG4gKiBAcmV0dXJuIEFjY3VyYWN5IFRlbnNvci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnTWV0cmljcycsIG5hbWVzcGFjZTogJ21ldHJpY3MnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluYXJ5Q3Jvc3NlbnRyb3B5KHlUcnVlOiBUZW5zb3IsIHlQcmVkOiBUZW5zb3IpOiBUZW5zb3Ige1xuICByZXR1cm4gbWV0cmljcy5iaW5hcnlDcm9zc2VudHJvcHkoeVRydWUsIHlQcmVkKTtcbn1cblxuLyoqXG4gKiBTcGFyc2UgY2F0ZWdvcmljYWwgYWNjdXJhY3kgbWV0cmljIGZ1bmN0aW9uLlxuICpcbiAqIEV4YW1wbGU6XG4gKiBgYGBqc1xuICpcbiAqIGNvbnN0IHlUcnVlID0gdGYudGVuc29yMWQoWzEsIDEsIDIsIDIsIDBdKTtcbiAqIGNvbnN0IHlQcmVkID0gdGYudGVuc29yMmQoXG4gKiAgICAgIFtbMCwgMSwgMF0sIFsxLCAwLCAwXSwgWzAsIDAuNCwgMC42XSwgWzAsIDAuNiwgMC40XSwgWzAuNywgMC4zLCAwXV0pO1xuICogY29uc3QgY3Jvc3NlbnRyb3B5ID0gdGYubWV0cmljcy5zcGFyc2VDYXRlZ29yaWNhbEFjY3VyYWN5KHlUcnVlLCB5UHJlZCk7XG4gKiBjcm9zc2VudHJvcHkucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB5VHJ1ZSBUcnVlIGxhYmVsczogaW5kaWNlcy5cbiAqIEBwYXJhbSB5UHJlZCBQcmVkaWN0ZWQgcHJvYmFiaWxpdGllcyBvciBsb2dpdHMuXG4gKiBAcmV0dXJucyBBY2N1cmFjeSB0ZW5zb3IuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ01ldHJpY3MnLCBuYW1lc3BhY2U6ICdtZXRyaWNzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwYXJzZUNhdGVnb3JpY2FsQWNjdXJhY3koXG4gICAgeVRydWU6IFRlbnNvciwgeVByZWQ6IFRlbnNvcik6IFRlbnNvciB7XG4gIHJldHVybiBtZXRyaWNzLnNwYXJzZUNhdGVnb3JpY2FsQWNjdXJhY3koeVRydWUsIHlQcmVkKTtcbn1cblxuLyoqXG4gKiBDYXRlZ29yaWNhbCBhY2N1cmFjeSBtZXRyaWMgZnVuY3Rpb24uXG4gKlxuICogRXhhbXBsZTpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMmQoW1swLCAwLCAwLCAxXSwgWzAsIDAsIDAsIDFdXSk7XG4gKiBjb25zdCB5ID0gdGYudGVuc29yMmQoW1swLjEsIDAuOCwgMC4wNSwgMC4wNV0sIFswLjEsIDAuMDUsIDAuMDUsIDAuOF1dKTtcbiAqIGNvbnN0IGFjY3VyYWN5ID0gdGYubWV0cmljcy5jYXRlZ29yaWNhbEFjY3VyYWN5KHgsIHkpO1xuICogYWNjdXJhY3kucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB5VHJ1ZSBCaW5hcnkgVGVuc29yIG9mIHRydXRoOiBvbmUtaG90IGVuY29kaW5nIG9mIGNhdGVnb3JpZXMuXG4gKiBAcGFyYW0geVByZWQgQmluYXJ5IFRlbnNvciBvZiBwcmVkaWN0aW9uOiBwcm9iYWJpbGl0aWVzIG9yIGxvZ2l0cyBmb3IgdGhlXG4gKiAgIHNhbWUgY2F0ZWdvcmllcyBhcyBpbiBgeVRydWVgLlxuICogQHJldHVybiBBY2N1cmFjeSBUZW5zb3IuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ01ldHJpY3MnLCBuYW1lc3BhY2U6ICdtZXRyaWNzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhdGVnb3JpY2FsQWNjdXJhY3koeVRydWU6IFRlbnNvciwgeVByZWQ6IFRlbnNvcik6IFRlbnNvciB7XG4gIHJldHVybiBtZXRyaWNzLmNhdGVnb3JpY2FsQWNjdXJhY3koeVRydWUsIHlQcmVkKTtcbn1cblxuLyoqXG4gKiBDYXRlZ29yaWNhbCBjcm9zc2VudHJvcHkgYmV0d2VlbiBhbiBvdXRwdXQgdGVuc29yIGFuZCBhIHRhcmdldCB0ZW5zb3IuXG4gKlxuICogQHBhcmFtIHRhcmdldCBBIHRlbnNvciBvZiB0aGUgc2FtZSBzaGFwZSBhcyBgb3V0cHV0YC5cbiAqIEBwYXJhbSBvdXRwdXQgQSB0ZW5zb3IgcmVzdWx0aW5nIGZyb20gYSBzb2Z0bWF4ICh1bmxlc3MgYGZyb21Mb2dpdHNgIGlzXG4gKiAgYHRydWVgLCBpbiB3aGljaCBjYXNlIGBvdXRwdXRgIGlzIGV4cGVjdGVkIHRvIGJlIHRoZSBsb2dpdHMpLlxuICogQHBhcmFtIGZyb21Mb2dpdHMgQm9vbGVhbiwgd2hldGhlciBgb3V0cHV0YCBpcyB0aGUgcmVzdWx0IG9mIGEgc29mdG1heCwgb3IgaXNcbiAqICAgYSB0ZW5zb3Igb2YgbG9naXRzLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdNZXRyaWNzJywgbmFtZXNwYWNlOiAnbWV0cmljcyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYXRlZ29yaWNhbENyb3NzZW50cm9weSh5VHJ1ZTogVGVuc29yLCB5UHJlZDogVGVuc29yKTogVGVuc29yIHtcbiAgcmV0dXJuIG1ldHJpY3MuY2F0ZWdvcmljYWxDcm9zc2VudHJvcHkoeVRydWUsIHlQcmVkKTtcbn1cblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgcHJlY2lzaW9uIG9mIHRoZSBwcmVkaWN0aW9ucyB3aXRoIHJlc3BlY3QgdG8gdGhlIGxhYmVscy5cbiAqXG4gKiBFeGFtcGxlOlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IyZChcbiAqICAgIFtcbiAqICAgICAgWzAsIDAsIDAsIDFdLFxuICogICAgICBbMCwgMSwgMCwgMF0sXG4gKiAgICAgIFswLCAwLCAwLCAxXSxcbiAqICAgICAgWzEsIDAsIDAsIDBdLFxuICogICAgICBbMCwgMCwgMSwgMF1cbiAqICAgIF1cbiAqICk7XG4gKlxuICogY29uc3QgeSA9IHRmLnRlbnNvcjJkKFxuICogICAgW1xuICogICAgICBbMCwgMCwgMSwgMF0sXG4gKiAgICAgIFswLCAxLCAwLCAwXSxcbiAqICAgICAgWzAsIDAsIDAsIDFdLFxuICogICAgICBbMCwgMSwgMCwgMF0sXG4gKiAgICAgIFswLCAxLCAwLCAwXVxuICogICAgXVxuICogKTtcbiAqXG4gKiBjb25zdCBwcmVjaXNpb24gPSB0Zi5tZXRyaWNzLnByZWNpc2lvbih4LCB5KTtcbiAqIHByZWNpc2lvbi5wcmludCgpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHlUcnVlIFRoZSBncm91bmQgdHJ1dGggdmFsdWVzLiBFeHBlY3RlZCB0byBjb250YWluIG9ubHkgMC0xIHZhbHVlcy5cbiAqIEBwYXJhbSB5UHJlZCBUaGUgcHJlZGljdGVkIHZhbHVlcy4gRXhwZWN0ZWQgdG8gY29udGFpbiBvbmx5IDAtMSB2YWx1ZXMuXG4gKiBAcmV0dXJuIFByZWNpc2lvbiBUZW5zb3IuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ01ldHJpY3MnLCBuYW1lc3BhY2U6ICdtZXRyaWNzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZWNpc2lvbih5VHJ1ZTogVGVuc29yLCB5UHJlZDogVGVuc29yKTogVGVuc29yIHtcbiAgcmV0dXJuIG1ldHJpY3MucHJlY2lzaW9uKHlUcnVlLCB5UHJlZCk7XG59XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIHJlY2FsbCBvZiB0aGUgcHJlZGljdGlvbnMgd2l0aCByZXNwZWN0IHRvIHRoZSBsYWJlbHMuXG4gKlxuICogRXhhbXBsZTpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMmQoXG4gKiAgICBbXG4gKiAgICAgIFswLCAwLCAwLCAxXSxcbiAqICAgICAgWzAsIDEsIDAsIDBdLFxuICogICAgICBbMCwgMCwgMCwgMV0sXG4gKiAgICAgIFsxLCAwLCAwLCAwXSxcbiAqICAgICAgWzAsIDAsIDEsIDBdXG4gKiAgICBdXG4gKiApO1xuICpcbiAqIGNvbnN0IHkgPSB0Zi50ZW5zb3IyZChcbiAqICAgIFtcbiAqICAgICAgWzAsIDAsIDEsIDBdLFxuICogICAgICBbMCwgMSwgMCwgMF0sXG4gKiAgICAgIFswLCAwLCAwLCAxXSxcbiAqICAgICAgWzAsIDEsIDAsIDBdLFxuICogICAgICBbMCwgMSwgMCwgMF1cbiAqICAgIF1cbiAqICk7XG4gKlxuICogY29uc3QgcmVjYWxsID0gdGYubWV0cmljcy5yZWNhbGwoeCwgeSk7XG4gKiByZWNhbGwucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB5VHJ1ZSBUaGUgZ3JvdW5kIHRydXRoIHZhbHVlcy4gRXhwZWN0ZWQgdG8gY29udGFpbiBvbmx5IDAtMSB2YWx1ZXMuXG4gKiBAcGFyYW0geVByZWQgVGhlIHByZWRpY3RlZCB2YWx1ZXMuIEV4cGVjdGVkIHRvIGNvbnRhaW4gb25seSAwLTEgdmFsdWVzLlxuICogQHJldHVybiBSZWNhbGwgVGVuc29yLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdNZXRyaWNzJywgbmFtZXNwYWNlOiAnbWV0cmljcyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWNhbGwoeVRydWU6IFRlbnNvciwgeVByZWQ6IFRlbnNvcik6IFRlbnNvciB7XG4gIHJldHVybiBtZXRyaWNzLnJlY2FsbCh5VHJ1ZSwgeVByZWQpO1xufVxuXG4vKipcbiAqIExvc3Mgb3IgbWV0cmljIGZ1bmN0aW9uOiBDb3NpbmUgcHJveGltaXR5LlxuICpcbiAqIE1hdGhlbWF0aWNhbGx5LCBjb3NpbmUgcHJveGltaXR5IGlzIGRlZmluZWQgYXM6XG4gKiAgIGAtc3VtKGwyTm9ybWFsaXplKHlUcnVlKSAqIGwyTm9ybWFsaXplKHlQcmVkKSlgLFxuICogd2hlcmVpbiBgbDJOb3JtYWxpemUoKWAgbm9ybWFsaXplcyB0aGUgTDIgbm9ybSBvZiB0aGUgaW5wdXQgdG8gMSBhbmQgYCpgXG4gKiByZXByZXNlbnRzIGVsZW1lbnQtd2lzZSBtdWx0aXBsaWNhdGlvbi5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeVRydWUgPSB0Zi50ZW5zb3IyZChbWzEsIDBdLCBbMSwgMF1dKTtcbiAqIGNvbnN0IHlQcmVkID0gdGYudGVuc29yMmQoW1sxIC8gTWF0aC5zcXJ0KDIpLCAxIC8gTWF0aC5zcXJ0KDIpXSwgWzAsIDFdXSk7XG4gKiBjb25zdCBwcm94aW1pdHkgPSB0Zi5tZXRyaWNzLmNvc2luZVByb3hpbWl0eSh5VHJ1ZSwgeVByZWQpO1xuICogcHJveGltaXR5LnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0geVRydWUgVHJ1dGggVGVuc29yLlxuICogQHBhcmFtIHlQcmVkIFByZWRpY3Rpb24gVGVuc29yLlxuICogQHJldHVybiBDb3NpbmUgcHJveGltaXR5IFRlbnNvci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnTWV0cmljcycsIG5hbWVzcGFjZTogJ21ldHJpY3MnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29zaW5lUHJveGltaXR5KHlUcnVlOiBUZW5zb3IsIHlQcmVkOiBUZW5zb3IpOiBUZW5zb3Ige1xuICByZXR1cm4gbG9zc2VzLmNvc2luZVByb3hpbWl0eSh5VHJ1ZSwgeVByZWQpO1xufVxuXG4vKipcbiAqIExvc3Mgb3IgbWV0cmljIGZ1bmN0aW9uOiBNZWFuIGFic29sdXRlIGVycm9yLlxuICpcbiAqIE1hdGhlbWF0aWNhbGx5LCBtZWFuIGFic29sdXRlIGVycm9yIGlzIGRlZmluZWQgYXM6XG4gKiAgIGBtZWFuKGFicyh5UHJlZCAtIHlUcnVlKSlgLFxuICogd2hlcmVpbiB0aGUgYG1lYW5gIGlzIGFwcGxpZWQgb3ZlciBmZWF0dXJlIGRpbWVuc2lvbnMuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHlUcnVlID0gdGYudGVuc29yMmQoW1swLCAxXSwgWzAsIDBdLCBbMiwgM11dKTtcbiAqIGNvbnN0IHlQcmVkID0gdGYudGVuc29yMmQoW1swLCAxXSwgWzAsIDFdLCBbLTIsIC0zXV0pO1xuICogY29uc3QgbXNlID0gdGYubWV0cmljcy5tZWFuQWJzb2x1dGVFcnJvcih5VHJ1ZSwgeVByZWQpO1xuICogbXNlLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0geVRydWUgVHJ1dGggVGVuc29yLlxuICogQHBhcmFtIHlQcmVkIFByZWRpY3Rpb24gVGVuc29yLlxuICogQHJldHVybiBNZWFuIGFic29sdXRlIGVycm9yIFRlbnNvci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnTWV0cmljcycsIG5hbWVzcGFjZTogJ21ldHJpY3MnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVhbkFic29sdXRlRXJyb3IoeVRydWU6IFRlbnNvciwgeVByZWQ6IFRlbnNvcik6IFRlbnNvciB7XG4gIHJldHVybiBsb3NzZXMubWVhbkFic29sdXRlRXJyb3IoeVRydWUsIHlQcmVkKTtcbn1cblxuLyoqXG4gKiBMb3NzIG9yIG1ldHJpYyBmdW5jdGlvbjogTWVhbiBhYnNvbHV0ZSBwZXJjZW50YWdlIGVycm9yLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB5VHJ1ZSA9IHRmLnRlbnNvcjJkKFtbMCwgMV0sIFsxMCwgMjBdXSk7XG4gKiBjb25zdCB5UHJlZCA9IHRmLnRlbnNvcjJkKFtbMCwgMV0sIFsxMSwgMjRdXSk7XG4gKiBjb25zdCBtc2UgPSB0Zi5tZXRyaWNzLm1lYW5BYnNvbHV0ZVBlcmNlbnRhZ2VFcnJvcih5VHJ1ZSwgeVByZWQpO1xuICogbXNlLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBBbGlhc2VzOiBgdGYubWV0cmljcy5NQVBFYCwgYHRmLm1ldHJpY3MubWFwZWAuXG4gKlxuICogQHBhcmFtIHlUcnVlIFRydXRoIFRlbnNvci5cbiAqIEBwYXJhbSB5UHJlZCBQcmVkaWN0aW9uIFRlbnNvci5cbiAqIEByZXR1cm4gTWVhbiBhYnNvbHV0ZSBwZXJjZW50YWdlIGVycm9yIFRlbnNvci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnTWV0cmljcycsIG5hbWVzcGFjZTogJ21ldHJpY3MnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVhbkFic29sdXRlUGVyY2VudGFnZUVycm9yKFxuICAgIHlUcnVlOiBUZW5zb3IsIHlQcmVkOiBUZW5zb3IpOiBUZW5zb3Ige1xuICByZXR1cm4gbG9zc2VzLm1lYW5BYnNvbHV0ZVBlcmNlbnRhZ2VFcnJvcih5VHJ1ZSwgeVByZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTUFQRSh5VHJ1ZTogVGVuc29yLCB5UHJlZDogVGVuc29yKTogVGVuc29yIHtcbiAgcmV0dXJuIGxvc3Nlcy5tZWFuQWJzb2x1dGVQZXJjZW50YWdlRXJyb3IoeVRydWUsIHlQcmVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcGUoeVRydWU6IFRlbnNvciwgeVByZWQ6IFRlbnNvcik6IFRlbnNvciB7XG4gIHJldHVybiBsb3NzZXMubWVhbkFic29sdXRlUGVyY2VudGFnZUVycm9yKHlUcnVlLCB5UHJlZCk7XG59XG5cbi8qKlxuICogTG9zcyBvciBtZXRyaWMgZnVuY3Rpb246IE1lYW4gc3F1YXJlZCBlcnJvci5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeVRydWUgPSB0Zi50ZW5zb3IyZChbWzAsIDFdLCBbMywgNF1dKTtcbiAqIGNvbnN0IHlQcmVkID0gdGYudGVuc29yMmQoW1swLCAxXSwgWy0zLCAtNF1dKTtcbiAqIGNvbnN0IG1zZSA9IHRmLm1ldHJpY3MubWVhblNxdWFyZWRFcnJvcih5VHJ1ZSwgeVByZWQpO1xuICogbXNlLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBBbGlhc2VzOiBgdGYubWV0cmljcy5NU0VgLCBgdGYubWV0cmljcy5tc2VgLlxuICpcbiAqIEBwYXJhbSB5VHJ1ZSBUcnV0aCBUZW5zb3IuXG4gKiBAcGFyYW0geVByZWQgUHJlZGljdGlvbiBUZW5zb3IuXG4gKiBAcmV0dXJuIE1lYW4gc3F1YXJlZCBlcnJvciBUZW5zb3IuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ01ldHJpY3MnLCBuYW1lc3BhY2U6ICdtZXRyaWNzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lYW5TcXVhcmVkRXJyb3IoeVRydWU6IFRlbnNvciwgeVByZWQ6IFRlbnNvcik6IFRlbnNvciB7XG4gIHJldHVybiBsb3NzZXMubWVhblNxdWFyZWRFcnJvcih5VHJ1ZSwgeVByZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTVNFKHlUcnVlOiBUZW5zb3IsIHlQcmVkOiBUZW5zb3IpOiBUZW5zb3Ige1xuICByZXR1cm4gbG9zc2VzLm1lYW5TcXVhcmVkRXJyb3IoeVRydWUsIHlQcmVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1zZSh5VHJ1ZTogVGVuc29yLCB5UHJlZDogVGVuc29yKTogVGVuc29yIHtcbiAgcmV0dXJuIGxvc3Nlcy5tZWFuU3F1YXJlZEVycm9yKHlUcnVlLCB5UHJlZCk7XG59XG4iXX0=