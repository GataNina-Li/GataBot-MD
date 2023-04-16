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
import { AdadeltaOptimizer } from './adadelta_optimizer';
import { AdagradOptimizer } from './adagrad_optimizer';
import { AdamOptimizer } from './adam_optimizer';
import { AdamaxOptimizer } from './adamax_optimizer';
import { MomentumOptimizer } from './momentum_optimizer';
import { RMSPropOptimizer } from './rmsprop_optimizer';
import { SGDOptimizer } from './sgd_optimizer';
export class OptimizerConstructors {
    /**
     * Constructs a `tf.SGDOptimizer` that uses stochastic gradient descent.
     *
     * ```js
     * // Fit a quadratic function by learning the coefficients a, b, c.
     * const xs = tf.tensor1d([0, 1, 2, 3]);
     * const ys = tf.tensor1d([1.1, 5.9, 16.8, 33.9]);
     *
     * const a = tf.scalar(Math.random()).variable();
     * const b = tf.scalar(Math.random()).variable();
     * const c = tf.scalar(Math.random()).variable();
     *
     * // y = a * x^2 + b * x + c.
     * const f = x => a.mul(x.square()).add(b.mul(x)).add(c);
     * const loss = (pred, label) => pred.sub(label).square().mean();
     *
     * const learningRate = 0.01;
     * const optimizer = tf.train.sgd(learningRate);
     *
     * // Train the model.
     * for (let i = 0; i < 10; i++) {
     *   optimizer.minimize(() => loss(f(xs), ys));
     * }
     *
     * // Make predictions.
     * console.log(
     *     `a: ${a.dataSync()}, b: ${b.dataSync()}, c: ${c.dataSync()}`);
     * const preds = f(xs).dataSync();
     * preds.forEach((pred, i) => {
     *   console.log(`x: ${i}, pred: ${pred}`);
     * });
     * ```
     *
     * @param learningRate The learning rate to use for the SGD algorithm.
     *
     * @doc {heading: 'Training', subheading: 'Optimizers', namespace: 'train'}
     */
    static sgd(learningRate) {
        return new SGDOptimizer(learningRate);
    }
    /**
     * Constructs a `tf.MomentumOptimizer` that uses momentum gradient
     * descent.
     *
     * See
     * [http://proceedings.mlr.press/v28/sutskever13.pdf](
     * http://proceedings.mlr.press/v28/sutskever13.pdf)
     *
     * @param learningRate The learning rate to use for the Momentum gradient
     * descent algorithm.
     * @param momentum The momentum to use for the momentum gradient descent
     * algorithm.
     *
     * @doc {heading: 'Training', subheading: 'Optimizers', namespace: 'train'}
     */
    static momentum(learningRate, momentum, useNesterov = false) {
        return new MomentumOptimizer(learningRate, momentum, useNesterov);
    }
    /**
     * Constructs a `tf.RMSPropOptimizer` that uses RMSProp gradient
     * descent. This implementation uses plain momentum and is not centered
     * version of RMSProp.
     *
     * See
     * [http://www.cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf](
     * http://www.cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf)
     *
     * @param learningRate The learning rate to use for the RMSProp gradient
     * descent algorithm.
     * @param decay The discounting factor for the history/coming gradient.
     * @param momentum The momentum to use for the RMSProp gradient descent
     * algorithm.
     * @param epsilon Small value to avoid zero denominator.
     * @param centered If true, gradients are normalized by the estimated
     * variance of the gradient.
     *
     * @doc {heading: 'Training', subheading: 'Optimizers', namespace: 'train'}
     */
    static rmsprop(learningRate, decay = .9, momentum = 0.0, epsilon = null, centered = false) {
        return new RMSPropOptimizer(learningRate, decay, momentum, epsilon, centered);
    }
    /**
     * Constructs a `tf.AdamOptimizer` that uses the Adam algorithm.
     * See [https://arxiv.org/abs/1412.6980](https://arxiv.org/abs/1412.6980)
     *
     * @param learningRate The learning rate to use for the Adam gradient
     * descent algorithm.
     * @param beta1 The exponential decay rate for the 1st moment estimates.
     * @param beta2 The exponential decay rate for the 2nd moment estimates.
     * @param epsilon A small constant for numerical stability.
     *
     * @doc {heading: 'Training', subheading: 'Optimizers', namespace: 'train'}
     */
    static adam(learningRate = 0.001, beta1 = 0.9, beta2 = 0.999, epsilon = null) {
        return new AdamOptimizer(learningRate, beta1, beta2, epsilon);
    }
    /**
     * Constructs a `tf.AdadeltaOptimizer` that uses the Adadelta algorithm.
     * See [https://arxiv.org/abs/1212.5701](https://arxiv.org/abs/1212.5701)
     *
     * @param learningRate The learning rate to use for the Adadelta gradient
     * descent algorithm.
     * @param rho The learning rate decay over each update.
     * @param epsilon A constant epsilon used to better condition the grad
     * update.
     *
     * @doc {heading: 'Training', subheading: 'Optimizers', namespace: 'train'}
     */
    static adadelta(learningRate = .001, rho = .95, epsilon = null) {
        return new AdadeltaOptimizer(learningRate, rho, epsilon);
    }
    /**
     * Constructs a `tf.AdamaxOptimizer` that uses the Adamax algorithm.
     * See [https://arxiv.org/abs/1412.6980](https://arxiv.org/abs/1412.6980)
     *
     * @param learningRate The learning rate to use for the Adamax gradient
     * descent algorithm.
     * @param beta1 The exponential decay rate for the 1st moment estimates.
     * @param beta2 The exponential decay rate for the 2nd moment estimates.
     * @param epsilon A small constant for numerical stability.
     * @param decay The learning rate decay over each update.
     *
     * @doc {heading: 'Training', subheading: 'Optimizers', namespace: 'train'}
     */
    static adamax(learningRate = 0.002, beta1 = 0.9, beta2 = 0.999, epsilon = null, decay = 0.0) {
        return new AdamaxOptimizer(learningRate, beta1, beta2, epsilon, decay);
    }
    /**
     * Constructs a `tf.AdagradOptimizer` that uses the Adagrad algorithm.
     * See
     * [http://www.jmlr.org/papers/volume12/duchi11a/duchi11a.pdf](
     * http://www.jmlr.org/papers/volume12/duchi11a/duchi11a.pdf)
     * or
     * [http://ruder.io/optimizing-gradient-descent/index.html#adagrad](
     * http://ruder.io/optimizing-gradient-descent/index.html#adagrad)
     *
     * @param learningRate The learning rate to use for the Adagrad gradient
     * descent algorithm.
     * @param initialAccumulatorValue Starting value for the accumulators, must be
     * positive.
     *
     * @doc {heading: 'Training', subheading: 'Optimizers', namespace: 'train'}
     */
    static adagrad(learningRate, initialAccumulatorValue = 0.1) {
        return new AdagradOptimizer(learningRate, initialAccumulatorValue);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVyX2NvbnN0cnVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3B0aW1pemVycy9vcHRpbWl6ZXJfY29uc3RydWN0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUMvQyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRTdDLE1BQU0sT0FBTyxxQkFBcUI7SUFDaEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW9DRztJQUNILE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBb0I7UUFDN0IsT0FBTyxJQUFJLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQW9CLEVBQUUsUUFBZ0IsRUFBRSxXQUFXLEdBQUcsS0FBSztRQUV6RSxPQUFPLElBQUksaUJBQWlCLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtQkc7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUNWLFlBQW9CLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxRQUFRLEdBQUcsR0FBRyxFQUFFLFVBQWtCLElBQUksRUFDeEUsUUFBUSxHQUFHLEtBQUs7UUFDbEIsT0FBTyxJQUFJLGdCQUFnQixDQUN2QixZQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FDUCxZQUFZLEdBQUcsS0FBSyxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFDaEQsVUFBa0IsSUFBSTtRQUN4QixPQUFPLElBQUksYUFBYSxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLElBQUksRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLFVBQWtCLElBQUk7UUFFcEUsT0FBTyxJQUFJLGlCQUFpQixDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7T0FZRztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQ1QsWUFBWSxHQUFHLEtBQUssRUFBRSxLQUFLLEdBQUcsR0FBRyxFQUFFLEtBQUssR0FBRyxLQUFLLEVBQUUsVUFBa0IsSUFBSSxFQUN4RSxLQUFLLEdBQUcsR0FBRztRQUNiLE9BQU8sSUFBSSxlQUFlLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQW9CLEVBQUUsdUJBQXVCLEdBQUcsR0FBRztRQUVoRSxPQUFPLElBQUksZ0JBQWdCLENBQUMsWUFBWSxFQUFFLHVCQUF1QixDQUFDLENBQUM7SUFDckUsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0FkYWRlbHRhT3B0aW1pemVyfSBmcm9tICcuL2FkYWRlbHRhX29wdGltaXplcic7XG5pbXBvcnQge0FkYWdyYWRPcHRpbWl6ZXJ9IGZyb20gJy4vYWRhZ3JhZF9vcHRpbWl6ZXInO1xuaW1wb3J0IHtBZGFtT3B0aW1pemVyfSBmcm9tICcuL2FkYW1fb3B0aW1pemVyJztcbmltcG9ydCB7QWRhbWF4T3B0aW1pemVyfSBmcm9tICcuL2FkYW1heF9vcHRpbWl6ZXInO1xuaW1wb3J0IHtNb21lbnR1bU9wdGltaXplcn0gZnJvbSAnLi9tb21lbnR1bV9vcHRpbWl6ZXInO1xuaW1wb3J0IHtSTVNQcm9wT3B0aW1pemVyfSBmcm9tICcuL3Jtc3Byb3Bfb3B0aW1pemVyJztcbmltcG9ydCB7U0dET3B0aW1pemVyfSBmcm9tICcuL3NnZF9vcHRpbWl6ZXInO1xuXG5leHBvcnQgY2xhc3MgT3B0aW1pemVyQ29uc3RydWN0b3JzIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBgdGYuU0dET3B0aW1pemVyYCB0aGF0IHVzZXMgc3RvY2hhc3RpYyBncmFkaWVudCBkZXNjZW50LlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiAvLyBGaXQgYSBxdWFkcmF0aWMgZnVuY3Rpb24gYnkgbGVhcm5pbmcgdGhlIGNvZWZmaWNpZW50cyBhLCBiLCBjLlxuICAgKiBjb25zdCB4cyA9IHRmLnRlbnNvcjFkKFswLCAxLCAyLCAzXSk7XG4gICAqIGNvbnN0IHlzID0gdGYudGVuc29yMWQoWzEuMSwgNS45LCAxNi44LCAzMy45XSk7XG4gICAqXG4gICAqIGNvbnN0IGEgPSB0Zi5zY2FsYXIoTWF0aC5yYW5kb20oKSkudmFyaWFibGUoKTtcbiAgICogY29uc3QgYiA9IHRmLnNjYWxhcihNYXRoLnJhbmRvbSgpKS52YXJpYWJsZSgpO1xuICAgKiBjb25zdCBjID0gdGYuc2NhbGFyKE1hdGgucmFuZG9tKCkpLnZhcmlhYmxlKCk7XG4gICAqXG4gICAqIC8vIHkgPSBhICogeF4yICsgYiAqIHggKyBjLlxuICAgKiBjb25zdCBmID0geCA9PiBhLm11bCh4LnNxdWFyZSgpKS5hZGQoYi5tdWwoeCkpLmFkZChjKTtcbiAgICogY29uc3QgbG9zcyA9IChwcmVkLCBsYWJlbCkgPT4gcHJlZC5zdWIobGFiZWwpLnNxdWFyZSgpLm1lYW4oKTtcbiAgICpcbiAgICogY29uc3QgbGVhcm5pbmdSYXRlID0gMC4wMTtcbiAgICogY29uc3Qgb3B0aW1pemVyID0gdGYudHJhaW4uc2dkKGxlYXJuaW5nUmF0ZSk7XG4gICAqXG4gICAqIC8vIFRyYWluIHRoZSBtb2RlbC5cbiAgICogZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAqICAgb3B0aW1pemVyLm1pbmltaXplKCgpID0+IGxvc3MoZih4cyksIHlzKSk7XG4gICAqIH1cbiAgICpcbiAgICogLy8gTWFrZSBwcmVkaWN0aW9ucy5cbiAgICogY29uc29sZS5sb2coXG4gICAqICAgICBgYTogJHthLmRhdGFTeW5jKCl9LCBiOiAke2IuZGF0YVN5bmMoKX0sIGM6ICR7Yy5kYXRhU3luYygpfWApO1xuICAgKiBjb25zdCBwcmVkcyA9IGYoeHMpLmRhdGFTeW5jKCk7XG4gICAqIHByZWRzLmZvckVhY2goKHByZWQsIGkpID0+IHtcbiAgICogICBjb25zb2xlLmxvZyhgeDogJHtpfSwgcHJlZDogJHtwcmVkfWApO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBsZWFybmluZ1JhdGUgVGhlIGxlYXJuaW5nIHJhdGUgdG8gdXNlIGZvciB0aGUgU0dEIGFsZ29yaXRobS5cbiAgICpcbiAgICogQGRvYyB7aGVhZGluZzogJ1RyYWluaW5nJywgc3ViaGVhZGluZzogJ09wdGltaXplcnMnLCBuYW1lc3BhY2U6ICd0cmFpbid9XG4gICAqL1xuICBzdGF0aWMgc2dkKGxlYXJuaW5nUmF0ZTogbnVtYmVyKTogU0dET3B0aW1pemVyIHtcbiAgICByZXR1cm4gbmV3IFNHRE9wdGltaXplcihsZWFybmluZ1JhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBgdGYuTW9tZW50dW1PcHRpbWl6ZXJgIHRoYXQgdXNlcyBtb21lbnR1bSBncmFkaWVudFxuICAgKiBkZXNjZW50LlxuICAgKlxuICAgKiBTZWVcbiAgICogW2h0dHA6Ly9wcm9jZWVkaW5ncy5tbHIucHJlc3MvdjI4L3N1dHNrZXZlcjEzLnBkZl0oXG4gICAqIGh0dHA6Ly9wcm9jZWVkaW5ncy5tbHIucHJlc3MvdjI4L3N1dHNrZXZlcjEzLnBkZilcbiAgICpcbiAgICogQHBhcmFtIGxlYXJuaW5nUmF0ZSBUaGUgbGVhcm5pbmcgcmF0ZSB0byB1c2UgZm9yIHRoZSBNb21lbnR1bSBncmFkaWVudFxuICAgKiBkZXNjZW50IGFsZ29yaXRobS5cbiAgICogQHBhcmFtIG1vbWVudHVtIFRoZSBtb21lbnR1bSB0byB1c2UgZm9yIHRoZSBtb21lbnR1bSBncmFkaWVudCBkZXNjZW50XG4gICAqIGFsZ29yaXRobS5cbiAgICpcbiAgICogQGRvYyB7aGVhZGluZzogJ1RyYWluaW5nJywgc3ViaGVhZGluZzogJ09wdGltaXplcnMnLCBuYW1lc3BhY2U6ICd0cmFpbid9XG4gICAqL1xuICBzdGF0aWMgbW9tZW50dW0obGVhcm5pbmdSYXRlOiBudW1iZXIsIG1vbWVudHVtOiBudW1iZXIsIHVzZU5lc3Rlcm92ID0gZmFsc2UpOlxuICAgICAgTW9tZW50dW1PcHRpbWl6ZXIge1xuICAgIHJldHVybiBuZXcgTW9tZW50dW1PcHRpbWl6ZXIobGVhcm5pbmdSYXRlLCBtb21lbnR1bSwgdXNlTmVzdGVyb3YpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBgdGYuUk1TUHJvcE9wdGltaXplcmAgdGhhdCB1c2VzIFJNU1Byb3AgZ3JhZGllbnRcbiAgICogZGVzY2VudC4gVGhpcyBpbXBsZW1lbnRhdGlvbiB1c2VzIHBsYWluIG1vbWVudHVtIGFuZCBpcyBub3QgY2VudGVyZWRcbiAgICogdmVyc2lvbiBvZiBSTVNQcm9wLlxuICAgKlxuICAgKiBTZWVcbiAgICogW2h0dHA6Ly93d3cuY3MudG9yb250by5lZHUvfnRpam1lbi9jc2MzMjEvc2xpZGVzL2xlY3R1cmVfc2xpZGVzX2xlYzYucGRmXShcbiAgICogaHR0cDovL3d3dy5jcy50b3JvbnRvLmVkdS9+dGlqbWVuL2NzYzMyMS9zbGlkZXMvbGVjdHVyZV9zbGlkZXNfbGVjNi5wZGYpXG4gICAqXG4gICAqIEBwYXJhbSBsZWFybmluZ1JhdGUgVGhlIGxlYXJuaW5nIHJhdGUgdG8gdXNlIGZvciB0aGUgUk1TUHJvcCBncmFkaWVudFxuICAgKiBkZXNjZW50IGFsZ29yaXRobS5cbiAgICogQHBhcmFtIGRlY2F5IFRoZSBkaXNjb3VudGluZyBmYWN0b3IgZm9yIHRoZSBoaXN0b3J5L2NvbWluZyBncmFkaWVudC5cbiAgICogQHBhcmFtIG1vbWVudHVtIFRoZSBtb21lbnR1bSB0byB1c2UgZm9yIHRoZSBSTVNQcm9wIGdyYWRpZW50IGRlc2NlbnRcbiAgICogYWxnb3JpdGhtLlxuICAgKiBAcGFyYW0gZXBzaWxvbiBTbWFsbCB2YWx1ZSB0byBhdm9pZCB6ZXJvIGRlbm9taW5hdG9yLlxuICAgKiBAcGFyYW0gY2VudGVyZWQgSWYgdHJ1ZSwgZ3JhZGllbnRzIGFyZSBub3JtYWxpemVkIGJ5IHRoZSBlc3RpbWF0ZWRcbiAgICogdmFyaWFuY2Ugb2YgdGhlIGdyYWRpZW50LlxuICAgKlxuICAgKiBAZG9jIHtoZWFkaW5nOiAnVHJhaW5pbmcnLCBzdWJoZWFkaW5nOiAnT3B0aW1pemVycycsIG5hbWVzcGFjZTogJ3RyYWluJ31cbiAgICovXG4gIHN0YXRpYyBybXNwcm9wKFxuICAgICAgbGVhcm5pbmdSYXRlOiBudW1iZXIsIGRlY2F5ID0gLjksIG1vbWVudHVtID0gMC4wLCBlcHNpbG9uOiBudW1iZXIgPSBudWxsLFxuICAgICAgY2VudGVyZWQgPSBmYWxzZSk6IFJNU1Byb3BPcHRpbWl6ZXIge1xuICAgIHJldHVybiBuZXcgUk1TUHJvcE9wdGltaXplcihcbiAgICAgICAgbGVhcm5pbmdSYXRlLCBkZWNheSwgbW9tZW50dW0sIGVwc2lsb24sIGNlbnRlcmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgYHRmLkFkYW1PcHRpbWl6ZXJgIHRoYXQgdXNlcyB0aGUgQWRhbSBhbGdvcml0aG0uXG4gICAqIFNlZSBbaHR0cHM6Ly9hcnhpdi5vcmcvYWJzLzE0MTIuNjk4MF0oaHR0cHM6Ly9hcnhpdi5vcmcvYWJzLzE0MTIuNjk4MClcbiAgICpcbiAgICogQHBhcmFtIGxlYXJuaW5nUmF0ZSBUaGUgbGVhcm5pbmcgcmF0ZSB0byB1c2UgZm9yIHRoZSBBZGFtIGdyYWRpZW50XG4gICAqIGRlc2NlbnQgYWxnb3JpdGhtLlxuICAgKiBAcGFyYW0gYmV0YTEgVGhlIGV4cG9uZW50aWFsIGRlY2F5IHJhdGUgZm9yIHRoZSAxc3QgbW9tZW50IGVzdGltYXRlcy5cbiAgICogQHBhcmFtIGJldGEyIFRoZSBleHBvbmVudGlhbCBkZWNheSByYXRlIGZvciB0aGUgMm5kIG1vbWVudCBlc3RpbWF0ZXMuXG4gICAqIEBwYXJhbSBlcHNpbG9uIEEgc21hbGwgY29uc3RhbnQgZm9yIG51bWVyaWNhbCBzdGFiaWxpdHkuXG4gICAqXG4gICAqIEBkb2Mge2hlYWRpbmc6ICdUcmFpbmluZycsIHN1YmhlYWRpbmc6ICdPcHRpbWl6ZXJzJywgbmFtZXNwYWNlOiAndHJhaW4nfVxuICAgKi9cbiAgc3RhdGljIGFkYW0oXG4gICAgICBsZWFybmluZ1JhdGUgPSAwLjAwMSwgYmV0YTEgPSAwLjksIGJldGEyID0gMC45OTksXG4gICAgICBlcHNpbG9uOiBudW1iZXIgPSBudWxsKTogQWRhbU9wdGltaXplciB7XG4gICAgcmV0dXJuIG5ldyBBZGFtT3B0aW1pemVyKGxlYXJuaW5nUmF0ZSwgYmV0YTEsIGJldGEyLCBlcHNpbG9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgYHRmLkFkYWRlbHRhT3B0aW1pemVyYCB0aGF0IHVzZXMgdGhlIEFkYWRlbHRhIGFsZ29yaXRobS5cbiAgICogU2VlIFtodHRwczovL2FyeGl2Lm9yZy9hYnMvMTIxMi41NzAxXShodHRwczovL2FyeGl2Lm9yZy9hYnMvMTIxMi41NzAxKVxuICAgKlxuICAgKiBAcGFyYW0gbGVhcm5pbmdSYXRlIFRoZSBsZWFybmluZyByYXRlIHRvIHVzZSBmb3IgdGhlIEFkYWRlbHRhIGdyYWRpZW50XG4gICAqIGRlc2NlbnQgYWxnb3JpdGhtLlxuICAgKiBAcGFyYW0gcmhvIFRoZSBsZWFybmluZyByYXRlIGRlY2F5IG92ZXIgZWFjaCB1cGRhdGUuXG4gICAqIEBwYXJhbSBlcHNpbG9uIEEgY29uc3RhbnQgZXBzaWxvbiB1c2VkIHRvIGJldHRlciBjb25kaXRpb24gdGhlIGdyYWRcbiAgICogdXBkYXRlLlxuICAgKlxuICAgKiBAZG9jIHtoZWFkaW5nOiAnVHJhaW5pbmcnLCBzdWJoZWFkaW5nOiAnT3B0aW1pemVycycsIG5hbWVzcGFjZTogJ3RyYWluJ31cbiAgICovXG4gIHN0YXRpYyBhZGFkZWx0YShsZWFybmluZ1JhdGUgPSAuMDAxLCByaG8gPSAuOTUsIGVwc2lsb246IG51bWJlciA9IG51bGwpOlxuICAgICAgQWRhZGVsdGFPcHRpbWl6ZXIge1xuICAgIHJldHVybiBuZXcgQWRhZGVsdGFPcHRpbWl6ZXIobGVhcm5pbmdSYXRlLCByaG8sIGVwc2lsb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBgdGYuQWRhbWF4T3B0aW1pemVyYCB0aGF0IHVzZXMgdGhlIEFkYW1heCBhbGdvcml0aG0uXG4gICAqIFNlZSBbaHR0cHM6Ly9hcnhpdi5vcmcvYWJzLzE0MTIuNjk4MF0oaHR0cHM6Ly9hcnhpdi5vcmcvYWJzLzE0MTIuNjk4MClcbiAgICpcbiAgICogQHBhcmFtIGxlYXJuaW5nUmF0ZSBUaGUgbGVhcm5pbmcgcmF0ZSB0byB1c2UgZm9yIHRoZSBBZGFtYXggZ3JhZGllbnRcbiAgICogZGVzY2VudCBhbGdvcml0aG0uXG4gICAqIEBwYXJhbSBiZXRhMSBUaGUgZXhwb25lbnRpYWwgZGVjYXkgcmF0ZSBmb3IgdGhlIDFzdCBtb21lbnQgZXN0aW1hdGVzLlxuICAgKiBAcGFyYW0gYmV0YTIgVGhlIGV4cG9uZW50aWFsIGRlY2F5IHJhdGUgZm9yIHRoZSAybmQgbW9tZW50IGVzdGltYXRlcy5cbiAgICogQHBhcmFtIGVwc2lsb24gQSBzbWFsbCBjb25zdGFudCBmb3IgbnVtZXJpY2FsIHN0YWJpbGl0eS5cbiAgICogQHBhcmFtIGRlY2F5IFRoZSBsZWFybmluZyByYXRlIGRlY2F5IG92ZXIgZWFjaCB1cGRhdGUuXG4gICAqXG4gICAqIEBkb2Mge2hlYWRpbmc6ICdUcmFpbmluZycsIHN1YmhlYWRpbmc6ICdPcHRpbWl6ZXJzJywgbmFtZXNwYWNlOiAndHJhaW4nfVxuICAgKi9cbiAgc3RhdGljIGFkYW1heChcbiAgICAgIGxlYXJuaW5nUmF0ZSA9IDAuMDAyLCBiZXRhMSA9IDAuOSwgYmV0YTIgPSAwLjk5OSwgZXBzaWxvbjogbnVtYmVyID0gbnVsbCxcbiAgICAgIGRlY2F5ID0gMC4wKTogQWRhbWF4T3B0aW1pemVyIHtcbiAgICByZXR1cm4gbmV3IEFkYW1heE9wdGltaXplcihsZWFybmluZ1JhdGUsIGJldGExLCBiZXRhMiwgZXBzaWxvbiwgZGVjYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBgdGYuQWRhZ3JhZE9wdGltaXplcmAgdGhhdCB1c2VzIHRoZSBBZGFncmFkIGFsZ29yaXRobS5cbiAgICogU2VlXG4gICAqIFtodHRwOi8vd3d3LmptbHIub3JnL3BhcGVycy92b2x1bWUxMi9kdWNoaTExYS9kdWNoaTExYS5wZGZdKFxuICAgKiBodHRwOi8vd3d3LmptbHIub3JnL3BhcGVycy92b2x1bWUxMi9kdWNoaTExYS9kdWNoaTExYS5wZGYpXG4gICAqIG9yXG4gICAqIFtodHRwOi8vcnVkZXIuaW8vb3B0aW1pemluZy1ncmFkaWVudC1kZXNjZW50L2luZGV4Lmh0bWwjYWRhZ3JhZF0oXG4gICAqIGh0dHA6Ly9ydWRlci5pby9vcHRpbWl6aW5nLWdyYWRpZW50LWRlc2NlbnQvaW5kZXguaHRtbCNhZGFncmFkKVxuICAgKlxuICAgKiBAcGFyYW0gbGVhcm5pbmdSYXRlIFRoZSBsZWFybmluZyByYXRlIHRvIHVzZSBmb3IgdGhlIEFkYWdyYWQgZ3JhZGllbnRcbiAgICogZGVzY2VudCBhbGdvcml0aG0uXG4gICAqIEBwYXJhbSBpbml0aWFsQWNjdW11bGF0b3JWYWx1ZSBTdGFydGluZyB2YWx1ZSBmb3IgdGhlIGFjY3VtdWxhdG9ycywgbXVzdCBiZVxuICAgKiBwb3NpdGl2ZS5cbiAgICpcbiAgICogQGRvYyB7aGVhZGluZzogJ1RyYWluaW5nJywgc3ViaGVhZGluZzogJ09wdGltaXplcnMnLCBuYW1lc3BhY2U6ICd0cmFpbid9XG4gICAqL1xuICBzdGF0aWMgYWRhZ3JhZChsZWFybmluZ1JhdGU6IG51bWJlciwgaW5pdGlhbEFjY3VtdWxhdG9yVmFsdWUgPSAwLjEpOlxuICAgICAgQWRhZ3JhZE9wdGltaXplciB7XG4gICAgcmV0dXJuIG5ldyBBZGFncmFkT3B0aW1pemVyKGxlYXJuaW5nUmF0ZSwgaW5pdGlhbEFjY3VtdWxhdG9yVmFsdWUpO1xuICB9XG59XG4iXX0=