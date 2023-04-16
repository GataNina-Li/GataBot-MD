/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
// tslint:disable-next-line:max-line-length
import { Constant, GlorotNormal, GlorotUniform, HeNormal, HeUniform, Identity, LeCunNormal, LeCunUniform, Ones, Orthogonal, RandomNormal, RandomUniform, TruncatedNormal, VarianceScaling, Zeros } from './initializers';
/**
 * Initializer that generates tensors initialized to 0.
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function zeros() {
    return new Zeros();
}
/**
 * Initializer that generates tensors initialized to 1.
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function ones() {
    return new Ones();
}
/**
 * Initializer that generates values initialized to some constant.
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function constant(args) {
    return new Constant(args);
}
/**
 * Initializer that generates random values initialized to a uniform
 * distribution.
 *
 * Values will be distributed uniformly between the configured minval and
 * maxval.
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function randomUniform(args) {
    return new RandomUniform(args);
}
/**
 * Initializer that generates random values initialized to a normal
 * distribution.
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function randomNormal(args) {
    return new RandomNormal(args);
}
/**
 * Initializer that generates random values initialized to a truncated normal
 * distribution.
 *
 * These values are similar to values from a `RandomNormal` except that values
 * more than two standard deviations from the mean are discarded and re-drawn.
 * This is the recommended initializer for neural network weights and filters.
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function truncatedNormal(args) {
    return new TruncatedNormal(args);
}
/**
 * Initializer that generates the identity matrix.
 * Only use for square 2D matrices.
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function identity(args) {
    return new Identity(args);
}
/**
 * Initializer capable of adapting its scale to the shape of weights.
 * With distribution=NORMAL, samples are drawn from a truncated normal
 * distribution centered on zero, with `stddev = sqrt(scale / n)` where n is:
 *   - number of input units in the weight tensor, if mode = FAN_IN.
 *   - number of output units, if mode = FAN_OUT.
 *   - average of the numbers of input and output units, if mode = FAN_AVG.
 * With distribution=UNIFORM,
 * samples are drawn from a uniform distribution
 * within [-limit, limit], with `limit = sqrt(3 * scale / n)`.
 *
 * @doc {heading: 'Initializers',namespace: 'initializers'}
 */
export function varianceScaling(config) {
    return new VarianceScaling(config);
}
/**
 * Glorot uniform initializer, also called Xavier uniform initializer.
 * It draws samples from a uniform distribution within [-limit, limit]
 * where `limit` is `sqrt(6 / (fan_in + fan_out))`
 * where `fan_in` is the number of input units in the weight tensor
 * and `fan_out` is the number of output units in the weight tensor
 *
 * Reference:
 *   Glorot & Bengio, AISTATS 2010
 *       http://jmlr.org/proceedings/papers/v9/glorot10a/glorot10a.pdf.
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function glorotUniform(args) {
    return new GlorotUniform(args);
}
/**
 * Glorot normal initializer, also called Xavier normal initializer.
 * It draws samples from a truncated normal distribution centered on 0
 * with `stddev = sqrt(2 / (fan_in + fan_out))`
 * where `fan_in` is the number of input units in the weight tensor
 * and `fan_out` is the number of output units in the weight tensor.
 *
 * Reference:
 *   Glorot & Bengio, AISTATS 2010
 *       http://jmlr.org/proceedings/papers/v9/glorot10a/glorot10a.pdf
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function glorotNormal(args) {
    return new GlorotNormal(args);
}
/**
 * He normal initializer.
 *
 * It draws samples from a truncated normal distribution centered on 0
 * with `stddev = sqrt(2 / fanIn)`
 * where `fanIn` is the number of input units in the weight tensor.
 *
 * Reference:
 *     He et al., http://arxiv.org/abs/1502.01852
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function heNormal(args) {
    return new HeNormal(args);
}
/**
 * He uniform initializer.
 *
 * It draws samples from a uniform distribution within [-limit, limit]
 * where `limit` is `sqrt(6 / fan_in)`
 * where `fanIn` is the number of input units in the weight tensor.
 *
 * Reference:
 *     He et al., http://arxiv.org/abs/1502.01852
 *
 * @doc {heading: 'Initializers',namespace: 'initializers'}
 */
export function heUniform(args) {
    return new HeUniform(args);
}
/**
 * LeCun normal initializer.
 *
 * It draws samples from a truncated normal distribution centered on 0
 * with `stddev = sqrt(1 / fanIn)`
 * where `fanIn` is the number of input units in the weight tensor.
 *
 * References:
 *   [Self-Normalizing Neural Networks](https://arxiv.org/abs/1706.02515)
 *   [Efficient Backprop](http://yann.lecun.com/exdb/publis/pdf/lecun-98b.pdf)
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function leCunNormal(args) {
    return new LeCunNormal(args);
}
/**
 * LeCun uniform initializer.
 *
 * It draws samples from a uniform distribution in the interval
 * `[-limit, limit]` with `limit = sqrt(3 / fanIn)`,
 * where `fanIn` is the number of input units in the weight tensor.
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function leCunUniform(args) {
    return new LeCunUniform(args);
}
/**
 * Initializer that generates a random orthogonal matrix.
 *
 * Reference:
 * [Saxe et al., http://arxiv.org/abs/1312.6120](http://arxiv.org/abs/1312.6120)
 *
 * @doc {heading: 'Initializers', namespace: 'initializers'}
 */
export function orthogonal(args) {
    return new Orthogonal(args);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0c19pbml0aWFsaXplcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvZXhwb3J0c19pbml0aWFsaXplcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0dBUUc7QUFDSCwyQ0FBMkM7QUFDM0MsT0FBTyxFQUFDLFFBQVEsRUFBZ0IsWUFBWSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBNkIsV0FBVyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFrQixZQUFZLEVBQW9CLGFBQWEsRUFBOEMsZUFBZSxFQUF1QixlQUFlLEVBQXVCLEtBQUssRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXhYOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsS0FBSztJQUNuQixPQUFPLElBQUksS0FBSyxFQUFFLENBQUM7QUFDckIsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsSUFBSTtJQUNsQixPQUFPLElBQUksSUFBSSxFQUFFLENBQUM7QUFDcEIsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUFDLElBQWtCO0lBQ3pDLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLGFBQWEsQ0FBQyxJQUF1QjtJQUNuRCxPQUFPLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQUMsSUFBc0I7SUFDakQsT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FBQyxJQUF5QjtJQUN2RCxPQUFPLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQUMsSUFBa0I7SUFDekMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRUQ7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FBQyxNQUEyQjtJQUN6RCxPQUFPLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsYUFBYSxDQUFDLElBQTZCO0lBQ3pELE9BQU8sSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQUMsSUFBNkI7SUFDeEQsT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUFDLElBQTZCO0lBQ3BELE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FBQyxJQUE2QjtJQUNyRCxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsV0FBVyxDQUFDLElBQTZCO0lBQ3ZELE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxJQUE2QjtJQUN4RCxPQUFPLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBQyxJQUFvQjtJQUM3QyxPQUFPLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gKiBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuaW1wb3J0IHtDb25zdGFudCwgQ29uc3RhbnRBcmdzLCBHbG9yb3ROb3JtYWwsIEdsb3JvdFVuaWZvcm0sIEhlTm9ybWFsLCBIZVVuaWZvcm0sIElkZW50aXR5LCBJZGVudGl0eUFyZ3MsIEluaXRpYWxpemVyLCBMZUN1bk5vcm1hbCwgTGVDdW5Vbmlmb3JtLCBPbmVzLCBPcnRob2dvbmFsLCBPcnRob2dvbmFsQXJncywgUmFuZG9tTm9ybWFsLCBSYW5kb21Ob3JtYWxBcmdzLCBSYW5kb21Vbmlmb3JtLCBSYW5kb21Vbmlmb3JtQXJncywgU2VlZE9ubHlJbml0aWFsaXplckFyZ3MsIFRydW5jYXRlZE5vcm1hbCwgVHJ1bmNhdGVkTm9ybWFsQXJncywgVmFyaWFuY2VTY2FsaW5nLCBWYXJpYW5jZVNjYWxpbmdBcmdzLCBaZXJvc30gZnJvbSAnLi9pbml0aWFsaXplcnMnO1xuXG4vKipcbiAqIEluaXRpYWxpemVyIHRoYXQgZ2VuZXJhdGVzIHRlbnNvcnMgaW5pdGlhbGl6ZWQgdG8gMC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnSW5pdGlhbGl6ZXJzJywgbmFtZXNwYWNlOiAnaW5pdGlhbGl6ZXJzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHplcm9zKCk6IFplcm9zIHtcbiAgcmV0dXJuIG5ldyBaZXJvcygpO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemVyIHRoYXQgZ2VuZXJhdGVzIHRlbnNvcnMgaW5pdGlhbGl6ZWQgdG8gMS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnSW5pdGlhbGl6ZXJzJywgbmFtZXNwYWNlOiAnaW5pdGlhbGl6ZXJzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uZXMoKTogSW5pdGlhbGl6ZXIge1xuICByZXR1cm4gbmV3IE9uZXMoKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplciB0aGF0IGdlbmVyYXRlcyB2YWx1ZXMgaW5pdGlhbGl6ZWQgdG8gc29tZSBjb25zdGFudC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnSW5pdGlhbGl6ZXJzJywgbmFtZXNwYWNlOiAnaW5pdGlhbGl6ZXJzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnN0YW50KGFyZ3M6IENvbnN0YW50QXJncyk6IEluaXRpYWxpemVyIHtcbiAgcmV0dXJuIG5ldyBDb25zdGFudChhcmdzKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplciB0aGF0IGdlbmVyYXRlcyByYW5kb20gdmFsdWVzIGluaXRpYWxpemVkIHRvIGEgdW5pZm9ybVxuICogZGlzdHJpYnV0aW9uLlxuICpcbiAqIFZhbHVlcyB3aWxsIGJlIGRpc3RyaWJ1dGVkIHVuaWZvcm1seSBiZXR3ZWVuIHRoZSBjb25maWd1cmVkIG1pbnZhbCBhbmRcbiAqIG1heHZhbC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnSW5pdGlhbGl6ZXJzJywgbmFtZXNwYWNlOiAnaW5pdGlhbGl6ZXJzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVVuaWZvcm0oYXJnczogUmFuZG9tVW5pZm9ybUFyZ3MpOiBJbml0aWFsaXplciB7XG4gIHJldHVybiBuZXcgUmFuZG9tVW5pZm9ybShhcmdzKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplciB0aGF0IGdlbmVyYXRlcyByYW5kb20gdmFsdWVzIGluaXRpYWxpemVkIHRvIGEgbm9ybWFsXG4gKiBkaXN0cmlidXRpb24uXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ0luaXRpYWxpemVycycsIG5hbWVzcGFjZTogJ2luaXRpYWxpemVycyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21Ob3JtYWwoYXJnczogUmFuZG9tTm9ybWFsQXJncyk6IEluaXRpYWxpemVyIHtcbiAgcmV0dXJuIG5ldyBSYW5kb21Ob3JtYWwoYXJncyk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXIgdGhhdCBnZW5lcmF0ZXMgcmFuZG9tIHZhbHVlcyBpbml0aWFsaXplZCB0byBhIHRydW5jYXRlZCBub3JtYWxcbiAqIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiBUaGVzZSB2YWx1ZXMgYXJlIHNpbWlsYXIgdG8gdmFsdWVzIGZyb20gYSBgUmFuZG9tTm9ybWFsYCBleGNlcHQgdGhhdCB2YWx1ZXNcbiAqIG1vcmUgdGhhbiB0d28gc3RhbmRhcmQgZGV2aWF0aW9ucyBmcm9tIHRoZSBtZWFuIGFyZSBkaXNjYXJkZWQgYW5kIHJlLWRyYXduLlxuICogVGhpcyBpcyB0aGUgcmVjb21tZW5kZWQgaW5pdGlhbGl6ZXIgZm9yIG5ldXJhbCBuZXR3b3JrIHdlaWdodHMgYW5kIGZpbHRlcnMuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ0luaXRpYWxpemVycycsIG5hbWVzcGFjZTogJ2luaXRpYWxpemVycyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cnVuY2F0ZWROb3JtYWwoYXJnczogVHJ1bmNhdGVkTm9ybWFsQXJncyk6IEluaXRpYWxpemVyIHtcbiAgcmV0dXJuIG5ldyBUcnVuY2F0ZWROb3JtYWwoYXJncyk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXIgdGhhdCBnZW5lcmF0ZXMgdGhlIGlkZW50aXR5IG1hdHJpeC5cbiAqIE9ubHkgdXNlIGZvciBzcXVhcmUgMkQgbWF0cmljZXMuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ0luaXRpYWxpemVycycsIG5hbWVzcGFjZTogJ2luaXRpYWxpemVycyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eShhcmdzOiBJZGVudGl0eUFyZ3MpOiBJbml0aWFsaXplciB7XG4gIHJldHVybiBuZXcgSWRlbnRpdHkoYXJncyk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXIgY2FwYWJsZSBvZiBhZGFwdGluZyBpdHMgc2NhbGUgdG8gdGhlIHNoYXBlIG9mIHdlaWdodHMuXG4gKiBXaXRoIGRpc3RyaWJ1dGlvbj1OT1JNQUwsIHNhbXBsZXMgYXJlIGRyYXduIGZyb20gYSB0cnVuY2F0ZWQgbm9ybWFsXG4gKiBkaXN0cmlidXRpb24gY2VudGVyZWQgb24gemVybywgd2l0aCBgc3RkZGV2ID0gc3FydChzY2FsZSAvIG4pYCB3aGVyZSBuIGlzOlxuICogICAtIG51bWJlciBvZiBpbnB1dCB1bml0cyBpbiB0aGUgd2VpZ2h0IHRlbnNvciwgaWYgbW9kZSA9IEZBTl9JTi5cbiAqICAgLSBudW1iZXIgb2Ygb3V0cHV0IHVuaXRzLCBpZiBtb2RlID0gRkFOX09VVC5cbiAqICAgLSBhdmVyYWdlIG9mIHRoZSBudW1iZXJzIG9mIGlucHV0IGFuZCBvdXRwdXQgdW5pdHMsIGlmIG1vZGUgPSBGQU5fQVZHLlxuICogV2l0aCBkaXN0cmlidXRpb249VU5JRk9STSxcbiAqIHNhbXBsZXMgYXJlIGRyYXduIGZyb20gYSB1bmlmb3JtIGRpc3RyaWJ1dGlvblxuICogd2l0aGluIFstbGltaXQsIGxpbWl0XSwgd2l0aCBgbGltaXQgPSBzcXJ0KDMgKiBzY2FsZSAvIG4pYC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnSW5pdGlhbGl6ZXJzJyxuYW1lc3BhY2U6ICdpbml0aWFsaXplcnMnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFyaWFuY2VTY2FsaW5nKGNvbmZpZzogVmFyaWFuY2VTY2FsaW5nQXJncyk6IEluaXRpYWxpemVyIHtcbiAgcmV0dXJuIG5ldyBWYXJpYW5jZVNjYWxpbmcoY29uZmlnKTtcbn1cblxuLyoqXG4gKiBHbG9yb3QgdW5pZm9ybSBpbml0aWFsaXplciwgYWxzbyBjYWxsZWQgWGF2aWVyIHVuaWZvcm0gaW5pdGlhbGl6ZXIuXG4gKiBJdCBkcmF3cyBzYW1wbGVzIGZyb20gYSB1bmlmb3JtIGRpc3RyaWJ1dGlvbiB3aXRoaW4gWy1saW1pdCwgbGltaXRdXG4gKiB3aGVyZSBgbGltaXRgIGlzIGBzcXJ0KDYgLyAoZmFuX2luICsgZmFuX291dCkpYFxuICogd2hlcmUgYGZhbl9pbmAgaXMgdGhlIG51bWJlciBvZiBpbnB1dCB1bml0cyBpbiB0aGUgd2VpZ2h0IHRlbnNvclxuICogYW5kIGBmYW5fb3V0YCBpcyB0aGUgbnVtYmVyIG9mIG91dHB1dCB1bml0cyBpbiB0aGUgd2VpZ2h0IHRlbnNvclxuICpcbiAqIFJlZmVyZW5jZTpcbiAqICAgR2xvcm90ICYgQmVuZ2lvLCBBSVNUQVRTIDIwMTBcbiAqICAgICAgIGh0dHA6Ly9qbWxyLm9yZy9wcm9jZWVkaW5ncy9wYXBlcnMvdjkvZ2xvcm90MTBhL2dsb3JvdDEwYS5wZGYuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ0luaXRpYWxpemVycycsIG5hbWVzcGFjZTogJ2luaXRpYWxpemVycyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnbG9yb3RVbmlmb3JtKGFyZ3M6IFNlZWRPbmx5SW5pdGlhbGl6ZXJBcmdzKTogSW5pdGlhbGl6ZXIge1xuICByZXR1cm4gbmV3IEdsb3JvdFVuaWZvcm0oYXJncyk7XG59XG5cbi8qKlxuICogR2xvcm90IG5vcm1hbCBpbml0aWFsaXplciwgYWxzbyBjYWxsZWQgWGF2aWVyIG5vcm1hbCBpbml0aWFsaXplci5cbiAqIEl0IGRyYXdzIHNhbXBsZXMgZnJvbSBhIHRydW5jYXRlZCBub3JtYWwgZGlzdHJpYnV0aW9uIGNlbnRlcmVkIG9uIDBcbiAqIHdpdGggYHN0ZGRldiA9IHNxcnQoMiAvIChmYW5faW4gKyBmYW5fb3V0KSlgXG4gKiB3aGVyZSBgZmFuX2luYCBpcyB0aGUgbnVtYmVyIG9mIGlucHV0IHVuaXRzIGluIHRoZSB3ZWlnaHQgdGVuc29yXG4gKiBhbmQgYGZhbl9vdXRgIGlzIHRoZSBudW1iZXIgb2Ygb3V0cHV0IHVuaXRzIGluIHRoZSB3ZWlnaHQgdGVuc29yLlxuICpcbiAqIFJlZmVyZW5jZTpcbiAqICAgR2xvcm90ICYgQmVuZ2lvLCBBSVNUQVRTIDIwMTBcbiAqICAgICAgIGh0dHA6Ly9qbWxyLm9yZy9wcm9jZWVkaW5ncy9wYXBlcnMvdjkvZ2xvcm90MTBhL2dsb3JvdDEwYS5wZGZcbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnSW5pdGlhbGl6ZXJzJywgbmFtZXNwYWNlOiAnaW5pdGlhbGl6ZXJzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdsb3JvdE5vcm1hbChhcmdzOiBTZWVkT25seUluaXRpYWxpemVyQXJncyk6IEluaXRpYWxpemVyIHtcbiAgcmV0dXJuIG5ldyBHbG9yb3ROb3JtYWwoYXJncyk7XG59XG5cbi8qKlxuICogSGUgbm9ybWFsIGluaXRpYWxpemVyLlxuICpcbiAqIEl0IGRyYXdzIHNhbXBsZXMgZnJvbSBhIHRydW5jYXRlZCBub3JtYWwgZGlzdHJpYnV0aW9uIGNlbnRlcmVkIG9uIDBcbiAqIHdpdGggYHN0ZGRldiA9IHNxcnQoMiAvIGZhbkluKWBcbiAqIHdoZXJlIGBmYW5JbmAgaXMgdGhlIG51bWJlciBvZiBpbnB1dCB1bml0cyBpbiB0aGUgd2VpZ2h0IHRlbnNvci5cbiAqXG4gKiBSZWZlcmVuY2U6XG4gKiAgICAgSGUgZXQgYWwuLCBodHRwOi8vYXJ4aXYub3JnL2Ficy8xNTAyLjAxODUyXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ0luaXRpYWxpemVycycsIG5hbWVzcGFjZTogJ2luaXRpYWxpemVycyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoZU5vcm1hbChhcmdzOiBTZWVkT25seUluaXRpYWxpemVyQXJncyk6IEluaXRpYWxpemVyIHtcbiAgcmV0dXJuIG5ldyBIZU5vcm1hbChhcmdzKTtcbn1cblxuLyoqXG4gKiBIZSB1bmlmb3JtIGluaXRpYWxpemVyLlxuICpcbiAqIEl0IGRyYXdzIHNhbXBsZXMgZnJvbSBhIHVuaWZvcm0gZGlzdHJpYnV0aW9uIHdpdGhpbiBbLWxpbWl0LCBsaW1pdF1cbiAqIHdoZXJlIGBsaW1pdGAgaXMgYHNxcnQoNiAvIGZhbl9pbilgXG4gKiB3aGVyZSBgZmFuSW5gIGlzIHRoZSBudW1iZXIgb2YgaW5wdXQgdW5pdHMgaW4gdGhlIHdlaWdodCB0ZW5zb3IuXG4gKlxuICogUmVmZXJlbmNlOlxuICogICAgIEhlIGV0IGFsLiwgaHR0cDovL2FyeGl2Lm9yZy9hYnMvMTUwMi4wMTg1MlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdJbml0aWFsaXplcnMnLG5hbWVzcGFjZTogJ2luaXRpYWxpemVycyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoZVVuaWZvcm0oYXJnczogU2VlZE9ubHlJbml0aWFsaXplckFyZ3MpOiBJbml0aWFsaXplciB7XG4gIHJldHVybiBuZXcgSGVVbmlmb3JtKGFyZ3MpO1xufVxuXG4vKipcbiAqIExlQ3VuIG5vcm1hbCBpbml0aWFsaXplci5cbiAqXG4gKiBJdCBkcmF3cyBzYW1wbGVzIGZyb20gYSB0cnVuY2F0ZWQgbm9ybWFsIGRpc3RyaWJ1dGlvbiBjZW50ZXJlZCBvbiAwXG4gKiB3aXRoIGBzdGRkZXYgPSBzcXJ0KDEgLyBmYW5JbilgXG4gKiB3aGVyZSBgZmFuSW5gIGlzIHRoZSBudW1iZXIgb2YgaW5wdXQgdW5pdHMgaW4gdGhlIHdlaWdodCB0ZW5zb3IuXG4gKlxuICogUmVmZXJlbmNlczpcbiAqICAgW1NlbGYtTm9ybWFsaXppbmcgTmV1cmFsIE5ldHdvcmtzXShodHRwczovL2FyeGl2Lm9yZy9hYnMvMTcwNi4wMjUxNSlcbiAqICAgW0VmZmljaWVudCBCYWNrcHJvcF0oaHR0cDovL3lhbm4ubGVjdW4uY29tL2V4ZGIvcHVibGlzL3BkZi9sZWN1bi05OGIucGRmKVxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdJbml0aWFsaXplcnMnLCBuYW1lc3BhY2U6ICdpbml0aWFsaXplcnMnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbGVDdW5Ob3JtYWwoYXJnczogU2VlZE9ubHlJbml0aWFsaXplckFyZ3MpOiBJbml0aWFsaXplciB7XG4gIHJldHVybiBuZXcgTGVDdW5Ob3JtYWwoYXJncyk7XG59XG5cbi8qKlxuICogTGVDdW4gdW5pZm9ybSBpbml0aWFsaXplci5cbiAqXG4gKiBJdCBkcmF3cyBzYW1wbGVzIGZyb20gYSB1bmlmb3JtIGRpc3RyaWJ1dGlvbiBpbiB0aGUgaW50ZXJ2YWxcbiAqIGBbLWxpbWl0LCBsaW1pdF1gIHdpdGggYGxpbWl0ID0gc3FydCgzIC8gZmFuSW4pYCxcbiAqIHdoZXJlIGBmYW5JbmAgaXMgdGhlIG51bWJlciBvZiBpbnB1dCB1bml0cyBpbiB0aGUgd2VpZ2h0IHRlbnNvci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnSW5pdGlhbGl6ZXJzJywgbmFtZXNwYWNlOiAnaW5pdGlhbGl6ZXJzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxlQ3VuVW5pZm9ybShhcmdzOiBTZWVkT25seUluaXRpYWxpemVyQXJncyk6IEluaXRpYWxpemVyIHtcbiAgcmV0dXJuIG5ldyBMZUN1blVuaWZvcm0oYXJncyk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXIgdGhhdCBnZW5lcmF0ZXMgYSByYW5kb20gb3J0aG9nb25hbCBtYXRyaXguXG4gKlxuICogUmVmZXJlbmNlOlxuICogW1NheGUgZXQgYWwuLCBodHRwOi8vYXJ4aXYub3JnL2Ficy8xMzEyLjYxMjBdKGh0dHA6Ly9hcnhpdi5vcmcvYWJzLzEzMTIuNjEyMClcbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnSW5pdGlhbGl6ZXJzJywgbmFtZXNwYWNlOiAnaW5pdGlhbGl6ZXJzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9ydGhvZ29uYWwoYXJnczogT3J0aG9nb25hbEFyZ3MpOiBJbml0aWFsaXplciB7XG4gIHJldHVybiBuZXcgT3J0aG9nb25hbChhcmdzKTtcbn1cbiJdfQ==