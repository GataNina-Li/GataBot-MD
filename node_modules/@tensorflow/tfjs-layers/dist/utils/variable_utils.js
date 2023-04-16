/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/**
 * Count the elements in an Array of LayerVariables.
 *
 * @param weights: The LayerVariables of which the constituent numbers are to
 *   be counted.
 * @returns A count of the elements in all the LayerVariables
 */
export function countParamsInWeights(weights) {
    let count = 0;
    for (const weight of weights) {
        if (weight.shape.length === 0) {
            count += 1;
        }
        else {
            count += weight.shape.reduce((a, b) => a * b);
        }
    }
    return count;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGVfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvdXRpbHMvdmFyaWFibGVfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0dBUUc7QUFJSDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsb0JBQW9CLENBQUMsT0FBd0I7SUFDM0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDNUIsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDN0IsS0FBSyxJQUFJLENBQUMsQ0FBQztTQUNaO2FBQU07WUFDTCxLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDL0M7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAqIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7TGF5ZXJWYXJpYWJsZX0gZnJvbSAnLi4vdmFyaWFibGVzJztcblxuLyoqXG4gKiBDb3VudCB0aGUgZWxlbWVudHMgaW4gYW4gQXJyYXkgb2YgTGF5ZXJWYXJpYWJsZXMuXG4gKlxuICogQHBhcmFtIHdlaWdodHM6IFRoZSBMYXllclZhcmlhYmxlcyBvZiB3aGljaCB0aGUgY29uc3RpdHVlbnQgbnVtYmVycyBhcmUgdG9cbiAqICAgYmUgY291bnRlZC5cbiAqIEByZXR1cm5zIEEgY291bnQgb2YgdGhlIGVsZW1lbnRzIGluIGFsbCB0aGUgTGF5ZXJWYXJpYWJsZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvdW50UGFyYW1zSW5XZWlnaHRzKHdlaWdodHM6IExheWVyVmFyaWFibGVbXSk6IG51bWJlciB7XG4gIGxldCBjb3VudCA9IDA7XG4gIGZvciAoY29uc3Qgd2VpZ2h0IG9mIHdlaWdodHMpIHtcbiAgICBpZiAod2VpZ2h0LnNoYXBlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY291bnQgKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgKz0gd2VpZ2h0LnNoYXBlLnJlZHVjZSgoYSwgYikgPT4gYSAqIGIpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY291bnQ7XG59XG4iXX0=