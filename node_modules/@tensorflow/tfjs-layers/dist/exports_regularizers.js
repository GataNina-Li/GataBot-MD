/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import * as regularizers from './regularizers';
// tslint:disable-next-line:max-line-length
import { L1L2 } from './regularizers';
/**
 * Regularizer for L1 and L2 regularization.
 *
 * Adds a term to the loss to penalize large weights:
 * loss += sum(l1 * abs(x)) + sum(l2 * x^2)
 *
 * @doc {heading: 'Regularizers', namespace: 'regularizers'}
 */
export function l1l2(config) {
    return new L1L2(config);
}
/**
 * Regularizer for L1 regularization.
 *
 * Adds a term to the loss to penalize large weights:
 * loss += sum(l1 * abs(x))
 * @param args l1 config.
 *
 * @doc {heading: 'Regularizers', namespace: 'regularizers'}
 */
export function l1(config) {
    return regularizers.l1(config);
}
/**
 * Regularizer for L2 regularization.
 *
 * Adds a term to the loss to penalize large weights:
 * loss += sum(l2 * x^2)
 * @param args l2 config.
 *
 * @doc {heading: 'Regularizers', namespace: 'regularizers'}
 */
export function l2(config) {
    return regularizers.l2(config);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0c19yZWd1bGFyaXplcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvZXhwb3J0c19yZWd1bGFyaXplcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0dBUUc7QUFDSCxPQUFPLEtBQUssWUFBWSxNQUFNLGdCQUFnQixDQUFDO0FBQy9DLDJDQUEyQztBQUMzQyxPQUFPLEVBQVMsSUFBSSxFQUFnQyxNQUFNLGdCQUFnQixDQUFDO0FBRTNFOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUFDLE1BQWlCO0lBQ3BDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLEVBQUUsQ0FBQyxNQUFlO0lBQ2hDLE9BQU8sWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsRUFBRSxDQUFDLE1BQWU7SUFDaEMsT0FBTyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gKiBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0ICogYXMgcmVndWxhcml6ZXJzIGZyb20gJy4vcmVndWxhcml6ZXJzJztcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbmltcG9ydCB7TDFBcmdzLCBMMUwyLCBMMUwyQXJncywgTDJBcmdzLCBSZWd1bGFyaXplcn0gZnJvbSAnLi9yZWd1bGFyaXplcnMnO1xuXG4vKipcbiAqIFJlZ3VsYXJpemVyIGZvciBMMSBhbmQgTDIgcmVndWxhcml6YXRpb24uXG4gKlxuICogQWRkcyBhIHRlcm0gdG8gdGhlIGxvc3MgdG8gcGVuYWxpemUgbGFyZ2Ugd2VpZ2h0czpcbiAqIGxvc3MgKz0gc3VtKGwxICogYWJzKHgpKSArIHN1bShsMiAqIHheMilcbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnUmVndWxhcml6ZXJzJywgbmFtZXNwYWNlOiAncmVndWxhcml6ZXJzJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGwxbDIoY29uZmlnPzogTDFMMkFyZ3MpOiBSZWd1bGFyaXplciB7XG4gIHJldHVybiBuZXcgTDFMMihjb25maWcpO1xufVxuXG4vKipcbiAqIFJlZ3VsYXJpemVyIGZvciBMMSByZWd1bGFyaXphdGlvbi5cbiAqXG4gKiBBZGRzIGEgdGVybSB0byB0aGUgbG9zcyB0byBwZW5hbGl6ZSBsYXJnZSB3ZWlnaHRzOlxuICogbG9zcyArPSBzdW0obDEgKiBhYnMoeCkpXG4gKiBAcGFyYW0gYXJncyBsMSBjb25maWcuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1JlZ3VsYXJpemVycycsIG5hbWVzcGFjZTogJ3JlZ3VsYXJpemVycyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsMShjb25maWc/OiBMMUFyZ3MpOiBSZWd1bGFyaXplciB7XG4gIHJldHVybiByZWd1bGFyaXplcnMubDEoY29uZmlnKTtcbn1cblxuLyoqXG4gKiBSZWd1bGFyaXplciBmb3IgTDIgcmVndWxhcml6YXRpb24uXG4gKlxuICogQWRkcyBhIHRlcm0gdG8gdGhlIGxvc3MgdG8gcGVuYWxpemUgbGFyZ2Ugd2VpZ2h0czpcbiAqIGxvc3MgKz0gc3VtKGwyICogeF4yKVxuICogQHBhcmFtIGFyZ3MgbDIgY29uZmlnLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdSZWd1bGFyaXplcnMnLCBuYW1lc3BhY2U6ICdyZWd1bGFyaXplcnMnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbDIoY29uZmlnPzogTDJBcmdzKTogUmVndWxhcml6ZXIge1xuICByZXR1cm4gcmVndWxhcml6ZXJzLmwyKGNvbmZpZyk7XG59XG4iXX0=