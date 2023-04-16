/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import { stringLiteralArray } from './utils';
/**
 * List of all known loss names.
 */
export const lossOptions = stringLiteralArray([
    'mean_squared_error', 'mean_absolute_error', 'mean_absolute_percentage_error',
    'mean_squared_logarithmic_error', 'squared_hinge', 'hinge',
    'categorical_hinge', 'logcosh', 'categorical_crossentropy',
    'sparse_categorical_crossentropy', 'kullback_leibler_divergence', 'poisson',
    'cosine_proximity'
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9zc19jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMva2VyYXNfZm9ybWF0L2xvc3NfY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUgsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRTNDOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDO0lBQzVDLG9CQUFvQixFQUFFLHFCQUFxQixFQUFFLGdDQUFnQztJQUM3RSxnQ0FBZ0MsRUFBRSxlQUFlLEVBQUUsT0FBTztJQUMxRCxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsMEJBQTBCO0lBQzFELGlDQUFpQyxFQUFFLDZCQUE2QixFQUFFLFNBQVM7SUFDM0Usa0JBQWtCO0NBQ25CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAqIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7c3RyaW5nTGl0ZXJhbEFycmF5fSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBMaXN0IG9mIGFsbCBrbm93biBsb3NzIG5hbWVzLlxuICovXG5leHBvcnQgY29uc3QgbG9zc09wdGlvbnMgPSBzdHJpbmdMaXRlcmFsQXJyYXkoW1xuICAnbWVhbl9zcXVhcmVkX2Vycm9yJywgJ21lYW5fYWJzb2x1dGVfZXJyb3InLCAnbWVhbl9hYnNvbHV0ZV9wZXJjZW50YWdlX2Vycm9yJyxcbiAgJ21lYW5fc3F1YXJlZF9sb2dhcml0aG1pY19lcnJvcicsICdzcXVhcmVkX2hpbmdlJywgJ2hpbmdlJyxcbiAgJ2NhdGVnb3JpY2FsX2hpbmdlJywgJ2xvZ2Nvc2gnLCAnY2F0ZWdvcmljYWxfY3Jvc3NlbnRyb3B5JyxcbiAgJ3NwYXJzZV9jYXRlZ29yaWNhbF9jcm9zc2VudHJvcHknLCAna3VsbGJhY2tfbGVpYmxlcl9kaXZlcmdlbmNlJywgJ3BvaXNzb24nLFxuICAnY29zaW5lX3Byb3hpbWl0eSdcbl0pO1xuXG4vKipcbiAqIEEgdHlwZSByZXByZXNlbnRpbmcgdGhlIHN0cmluZ3MgdGhhdCBhcmUgdmFsaWQgbG9zcyBuYW1lcy5cbiAqL1xuZXhwb3J0IHR5cGUgTG9zc0lkZW50aWZpZXIgPSB0eXBlb2YgbG9zc09wdGlvbnNbbnVtYmVyXTtcbiJdfQ==