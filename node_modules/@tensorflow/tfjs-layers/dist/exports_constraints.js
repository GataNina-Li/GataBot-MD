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
import { MaxNorm, MinMaxNorm, NonNeg, UnitNorm } from './constraints';
/**
 * MaxNorm weight constraint.
 *
 * Constrains the weights incident to each hidden unit
 * to have a norm less than or equal to a desired value.
 *
 * References
 *       - [Dropout: A Simple Way to Prevent Neural Networks from Overfitting
 * Srivastava, Hinton, et al.
 * 2014](http://www.cs.toronto.edu/~rsalakhu/papers/srivastava14a.pdf)
 *
 * @doc {heading: 'Constraints',namespace: 'constraints'}
 */
export function maxNorm(args) {
    return new MaxNorm(args);
}
/**
 * Constrains the weights incident to each hidden unit to have unit norm.
 *
 * @doc {heading: 'Constraints', namespace: 'constraints'}
 */
export function unitNorm(args) {
    return new UnitNorm(args);
}
/**
 * Constrains the weight to be non-negative.
 *
 * @doc {heading: 'Constraints', namespace: 'constraints'}
 */
export function nonNeg() {
    return new NonNeg();
}
/** @doc {heading: 'Constraints', namespace: 'constraints'} */
export function minMaxNorm(config) {
    return new MinMaxNorm(config);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0c19jb25zdHJhaW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtbGF5ZXJzL3NyYy9leHBvcnRzX2NvbnN0cmFpbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBQ0gsMkNBQTJDO0FBQzNDLE9BQU8sRUFBYSxPQUFPLEVBQWUsVUFBVSxFQUFrQixNQUFNLEVBQUUsUUFBUSxFQUFlLE1BQU0sZUFBZSxDQUFDO0FBRTNIOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILE1BQU0sVUFBVSxPQUFPLENBQUMsSUFBaUI7SUFDdkMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQUMsSUFBa0I7SUFDekMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxNQUFNO0lBQ3BCLE9BQU8sSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUN0QixDQUFDO0FBRUQsOERBQThEO0FBQzlELE1BQU0sVUFBVSxVQUFVLENBQUMsTUFBc0I7SUFDL0MsT0FBTyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbmltcG9ydCB7Q29uc3RyYWludCwgTWF4Tm9ybSwgTWF4Tm9ybUFyZ3MsIE1pbk1heE5vcm0sIE1pbk1heE5vcm1BcmdzLCBOb25OZWcsIFVuaXROb3JtLCBVbml0Tm9ybUFyZ3N9IGZyb20gJy4vY29uc3RyYWludHMnO1xuXG4vKipcbiAqIE1heE5vcm0gd2VpZ2h0IGNvbnN0cmFpbnQuXG4gKlxuICogQ29uc3RyYWlucyB0aGUgd2VpZ2h0cyBpbmNpZGVudCB0byBlYWNoIGhpZGRlbiB1bml0XG4gKiB0byBoYXZlIGEgbm9ybSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYSBkZXNpcmVkIHZhbHVlLlxuICpcbiAqIFJlZmVyZW5jZXNcbiAqICAgICAgIC0gW0Ryb3BvdXQ6IEEgU2ltcGxlIFdheSB0byBQcmV2ZW50IE5ldXJhbCBOZXR3b3JrcyBmcm9tIE92ZXJmaXR0aW5nXG4gKiBTcml2YXN0YXZhLCBIaW50b24sIGV0IGFsLlxuICogMjAxNF0oaHR0cDovL3d3dy5jcy50b3JvbnRvLmVkdS9+cnNhbGFraHUvcGFwZXJzL3NyaXZhc3RhdmExNGEucGRmKVxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdDb25zdHJhaW50cycsbmFtZXNwYWNlOiAnY29uc3RyYWludHMnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWF4Tm9ybShhcmdzOiBNYXhOb3JtQXJncyk6IENvbnN0cmFpbnQge1xuICByZXR1cm4gbmV3IE1heE5vcm0oYXJncyk7XG59XG5cbi8qKlxuICogQ29uc3RyYWlucyB0aGUgd2VpZ2h0cyBpbmNpZGVudCB0byBlYWNoIGhpZGRlbiB1bml0IHRvIGhhdmUgdW5pdCBub3JtLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdDb25zdHJhaW50cycsIG5hbWVzcGFjZTogJ2NvbnN0cmFpbnRzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXROb3JtKGFyZ3M6IFVuaXROb3JtQXJncyk6IENvbnN0cmFpbnQge1xuICByZXR1cm4gbmV3IFVuaXROb3JtKGFyZ3MpO1xufVxuXG4vKipcbiAqIENvbnN0cmFpbnMgdGhlIHdlaWdodCB0byBiZSBub24tbmVnYXRpdmUuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ0NvbnN0cmFpbnRzJywgbmFtZXNwYWNlOiAnY29uc3RyYWludHMnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9uTmVnKCk6IENvbnN0cmFpbnQge1xuICByZXR1cm4gbmV3IE5vbk5lZygpO1xufVxuXG4vKiogQGRvYyB7aGVhZGluZzogJ0NvbnN0cmFpbnRzJywgbmFtZXNwYWNlOiAnY29uc3RyYWludHMnfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pbk1heE5vcm0oY29uZmlnOiBNaW5NYXhOb3JtQXJncyk6IENvbnN0cmFpbnQge1xuICByZXR1cm4gbmV3IE1pbk1heE5vcm0oY29uZmlnKTtcbn1cbiJdfQ==