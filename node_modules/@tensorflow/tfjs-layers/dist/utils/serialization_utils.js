/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import * as generic_utils from '../utils/generic_utils';
// tslint:enable
/**
 * Test whether a value in an array is the name of a LayersModel or Layer.
 * @param key The key name that the value is found under. Note that the key
 *   may not be at the level immediately above the value, if the value is in a
 *   nested array.
 * @param index Index of the value in the Array that it is found in.
 * @param value The value object.
 * @returns A boolean indicating whether value is a name.
 */
function isArrayItemInputOrOutputName(key, index, value) {
    return (key === 'inboundNodes' || key === 'outputLayers' ||
        key === 'inputLayers') &&
        index === 0 && typeof value === 'string';
}
/**
 * Convert a Pythonic config object to TypeScript config object.
 * @param pythonicConfig The config object to convert.
 * @param key Optional key name of the object being converted.
 * @returns Result of the conversion.
 */
export function convertPythonicToTs(pythonicConfig, key) {
    if (pythonicConfig === null) {
        return null;
    }
    else if (typeof pythonicConfig === 'string') {
        return generic_utils.toCamelCase(pythonicConfig);
    }
    else if ((typeof pythonicConfig === 'number') ||
        (typeof pythonicConfig === 'boolean')) {
        return pythonicConfig;
    }
    else if (pythonicConfig instanceof Array) {
        const tsArray = [];
        const arrayLength = pythonicConfig.length;
        for (let i = 0; i < arrayLength; ++i) {
            const item = pythonicConfig[i];
            if (isArrayItemInputOrOutputName(key, i, item)) {
                tsArray.push(item);
            }
            else {
                tsArray.push(convertPythonicToTs(item, key));
            }
        }
        return tsArray;
    }
    else {
        const tsDict = {};
        for (const pythonicKey of Object.keys(pythonicConfig)) {
            const pythonicValue = pythonicConfig[pythonicKey];
            if (pythonicKey === 'name' && typeof pythonicValue === 'string') {
                // Special case the 'name' key with a string value. Name values, such as
                // the names of LayersModel and Layer instances, should not undergo the
                // camel-case conversion.
                tsDict[pythonicKey] = pythonicValue;
            }
            else {
                const tsKey = generic_utils.toCamelCase(pythonicKey);
                tsDict[tsKey] = convertPythonicToTs(pythonicValue, tsKey);
            }
        }
        return tsDict;
    }
}
/**
 * Convert a TypeScript config object to Python config object.
 * @param tsConfig The config object to convert.
 * @param key Optional key name of the object being converted.
 * @returns Result of the conversion.
 */
export function convertTsToPythonic(tsConfig, key) {
    if (tsConfig === null || tsConfig === undefined) {
        return null;
    }
    else if (typeof tsConfig === 'string') {
        return generic_utils.toSnakeCase(tsConfig);
    }
    else if ((typeof tsConfig === 'number') || (typeof tsConfig === 'boolean')) {
        return tsConfig;
    }
    else if (tsConfig instanceof Array) {
        const pyArray = [];
        const arrayLength = tsConfig.length;
        for (let i = 0; i < arrayLength; ++i) {
            const item = tsConfig[i];
            if (isArrayItemInputOrOutputName(key, i, item)) {
                pyArray.push(item);
            }
            else {
                pyArray.push(convertTsToPythonic(item, key));
            }
        }
        return pyArray;
    }
    else {
        const pyDict = {};
        for (const tsKey of Object.keys(tsConfig)) {
            const tsValue = tsConfig[tsKey];
            const pyKey = generic_utils.toSnakeCase(tsKey);
            if ((tsKey === 'name' || tsKey === 'className') &&
                typeof tsValue === 'string') {
                // Special case the 'name' key with a string value. Name values, such as
                // the names of LayersModel and Layer instances, should not undergo the
                // snake-case conversion.
                pyDict[pyKey] = tsValue;
            }
            else {
                pyDict[pyKey] = convertTsToPythonic(tsValue, tsKey);
            }
        }
        return pyDict;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXphdGlvbl91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtbGF5ZXJzL3NyYy91dGlscy9zZXJpYWxpemF0aW9uX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBVUgsT0FBTyxLQUFLLGFBQWEsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxnQkFBZ0I7QUFFaEI7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFTLDRCQUE0QixDQUNqQyxHQUFXLEVBQUUsS0FBYSxFQUFFLEtBQVE7SUFDdEMsT0FBTyxDQUFDLEdBQUcsS0FBSyxjQUFjLElBQUksR0FBRyxLQUFLLGNBQWM7UUFDaEQsR0FBRyxLQUFLLGFBQWEsQ0FBQztRQUMxQixLQUFLLEtBQUssQ0FBQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztBQUMvQyxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsbUJBQW1CLENBQy9CLGNBQTJCLEVBQUUsR0FBWTtJQUMzQyxJQUFJLGNBQWMsS0FBSyxJQUFJLEVBQUU7UUFDM0IsT0FBTyxJQUFJLENBQUM7S0FDYjtTQUFNLElBQUksT0FBTyxjQUFjLEtBQUssUUFBUSxFQUFFO1FBQzdDLE9BQU8sYUFBYSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUNsRDtTQUFNLElBQ0gsQ0FBQyxPQUFPLGNBQWMsS0FBSyxRQUFRLENBQUM7UUFDcEMsQ0FBQyxPQUFPLGNBQWMsS0FBSyxTQUFTLENBQUMsRUFBRTtRQUN6QyxPQUFPLGNBQWMsQ0FBQztLQUN2QjtTQUFNLElBQUksY0FBYyxZQUFZLEtBQUssRUFBRTtRQUMxQyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbkIsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLDRCQUE0QixDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQzlDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUM5QztTQUNGO1FBQ0QsT0FBTyxPQUFPLENBQUM7S0FDaEI7U0FBTTtRQUNMLE1BQU0sTUFBTSxHQUE2QixFQUFFLENBQUM7UUFDNUMsS0FBSyxNQUFNLFdBQVcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ3JELE1BQU0sYUFBYSxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRCxJQUFJLFdBQVcsS0FBSyxNQUFNLElBQUksT0FBTyxhQUFhLEtBQUssUUFBUSxFQUFFO2dCQUMvRCx3RUFBd0U7Z0JBQ3hFLHVFQUF1RTtnQkFDdkUseUJBQXlCO2dCQUN6QixNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsYUFBYSxDQUFDO2FBQ3JDO2lCQUFNO2dCQUNMLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3JELE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDM0Q7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDO0tBQ2Y7QUFDSCxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsbUJBQW1CLENBQy9CLFFBQXVDLEVBQUUsR0FBWTtJQUN2RCxJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtRQUMvQyxPQUFPLElBQUksQ0FBQztLQUNiO1NBQU0sSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDdkMsT0FBTyxhQUFhLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzVDO1NBQU0sSUFDSCxDQUFDLE9BQU8sUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLEtBQUssU0FBUyxDQUFDLEVBQUU7UUFDckUsT0FBTyxRQUFRLENBQUM7S0FDakI7U0FBTSxJQUFJLFFBQVEsWUFBWSxLQUFLLEVBQUU7UUFDcEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ25CLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDcEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUNwQyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBSSw0QkFBNEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUM5QyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDOUM7U0FDRjtRQUNELE9BQU8sT0FBTyxDQUFDO0tBQ2hCO1NBQU07UUFDTCxNQUFNLE1BQU0sR0FBNkIsRUFBRSxDQUFDO1FBQzVDLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN6QyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQU0sSUFBSSxLQUFLLEtBQUssV0FBVyxDQUFDO2dCQUMzQyxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7Z0JBQy9CLHdFQUF3RTtnQkFDeEUsdUVBQXVFO2dCQUN2RSx5QkFBeUI7Z0JBQ3pCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUM7YUFDekI7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNyRDtTQUNGO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDZjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gKiBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vLyBQb3J0aW5nIG5vdGU6IFRoaXMgZmlsZSBkb2Vzbid0IGV4aXN0IGluIFB5S2VyYXMuXG4vLyBJdHMgcHVycG9zZSBoZXJlIGlzIHRvIGNlbnRyYWxpemUgdGhlIGJvdW5kYXJ5IGxheWVyIGJldHdlZW5cbi8vIHRmanMtbGF5ZXJzJ3MgaW50ZXJuYWwgQ29uZmlnIFRTLUNlbnRyaWMgZm9ybWF0IGFuZCBQeUtlcmFzJ3Ncbi8vIHNlcmlhbGl6ZWQgUHl0aG9uIENvbmZpZyBmb3JtYXQuXG5cbmltcG9ydCB7c2VyaWFsaXphdGlvbn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtQeUpzb25WYWx1ZX0gZnJvbSAnLi4va2VyYXNfZm9ybWF0L3R5cGVzJztcbmltcG9ydCAqIGFzIGdlbmVyaWNfdXRpbHMgZnJvbSAnLi4vdXRpbHMvZ2VuZXJpY191dGlscyc7XG4vLyB0c2xpbnQ6ZW5hYmxlXG5cbi8qKlxuICogVGVzdCB3aGV0aGVyIGEgdmFsdWUgaW4gYW4gYXJyYXkgaXMgdGhlIG5hbWUgb2YgYSBMYXllcnNNb2RlbCBvciBMYXllci5cbiAqIEBwYXJhbSBrZXkgVGhlIGtleSBuYW1lIHRoYXQgdGhlIHZhbHVlIGlzIGZvdW5kIHVuZGVyLiBOb3RlIHRoYXQgdGhlIGtleVxuICogICBtYXkgbm90IGJlIGF0IHRoZSBsZXZlbCBpbW1lZGlhdGVseSBhYm92ZSB0aGUgdmFsdWUsIGlmIHRoZSB2YWx1ZSBpcyBpbiBhXG4gKiAgIG5lc3RlZCBhcnJheS5cbiAqIEBwYXJhbSBpbmRleCBJbmRleCBvZiB0aGUgdmFsdWUgaW4gdGhlIEFycmF5IHRoYXQgaXQgaXMgZm91bmQgaW4uXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIG9iamVjdC5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdmFsdWUgaXMgYSBuYW1lLlxuICovXG5mdW5jdGlvbiBpc0FycmF5SXRlbUlucHV0T3JPdXRwdXROYW1lPFQ+KFxuICAgIGtleTogc3RyaW5nLCBpbmRleDogbnVtYmVyLCB2YWx1ZTogVCk6IGJvb2xlYW4ge1xuICByZXR1cm4gKGtleSA9PT0gJ2luYm91bmROb2RlcycgfHwga2V5ID09PSAnb3V0cHV0TGF5ZXJzJyB8fFxuICAgICAgICAgIGtleSA9PT0gJ2lucHV0TGF5ZXJzJykgJiZcbiAgICAgIGluZGV4ID09PSAwICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogQ29udmVydCBhIFB5dGhvbmljIGNvbmZpZyBvYmplY3QgdG8gVHlwZVNjcmlwdCBjb25maWcgb2JqZWN0LlxuICogQHBhcmFtIHB5dGhvbmljQ29uZmlnIFRoZSBjb25maWcgb2JqZWN0IHRvIGNvbnZlcnQuXG4gKiBAcGFyYW0ga2V5IE9wdGlvbmFsIGtleSBuYW1lIG9mIHRoZSBvYmplY3QgYmVpbmcgY29udmVydGVkLlxuICogQHJldHVybnMgUmVzdWx0IG9mIHRoZSBjb252ZXJzaW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFB5dGhvbmljVG9UcyhcbiAgICBweXRob25pY0NvbmZpZzogUHlKc29uVmFsdWUsIGtleT86IHN0cmluZyk6IHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdFZhbHVlIHtcbiAgaWYgKHB5dGhvbmljQ29uZmlnID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHB5dGhvbmljQ29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBnZW5lcmljX3V0aWxzLnRvQ2FtZWxDYXNlKHB5dGhvbmljQ29uZmlnKTtcbiAgfSBlbHNlIGlmIChcbiAgICAgICh0eXBlb2YgcHl0aG9uaWNDb25maWcgPT09ICdudW1iZXInKSB8fFxuICAgICAgKHR5cGVvZiBweXRob25pY0NvbmZpZyA9PT0gJ2Jvb2xlYW4nKSkge1xuICAgIHJldHVybiBweXRob25pY0NvbmZpZztcbiAgfSBlbHNlIGlmIChweXRob25pY0NvbmZpZyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgY29uc3QgdHNBcnJheSA9IFtdO1xuICAgIGNvbnN0IGFycmF5TGVuZ3RoID0gcHl0aG9uaWNDb25maWcubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXlMZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgaXRlbSA9IHB5dGhvbmljQ29uZmlnW2ldO1xuICAgICAgaWYgKGlzQXJyYXlJdGVtSW5wdXRPck91dHB1dE5hbWUoa2V5LCBpLCBpdGVtKSkge1xuICAgICAgICB0c0FycmF5LnB1c2goaXRlbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0c0FycmF5LnB1c2goY29udmVydFB5dGhvbmljVG9UcyhpdGVtLCBrZXkpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRzQXJyYXk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdHNEaWN0OiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3QgPSB7fTtcbiAgICBmb3IgKGNvbnN0IHB5dGhvbmljS2V5IG9mIE9iamVjdC5rZXlzKHB5dGhvbmljQ29uZmlnKSkge1xuICAgICAgY29uc3QgcHl0aG9uaWNWYWx1ZSA9IHB5dGhvbmljQ29uZmlnW3B5dGhvbmljS2V5XTtcbiAgICAgIGlmIChweXRob25pY0tleSA9PT0gJ25hbWUnICYmIHR5cGVvZiBweXRob25pY1ZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBTcGVjaWFsIGNhc2UgdGhlICduYW1lJyBrZXkgd2l0aCBhIHN0cmluZyB2YWx1ZS4gTmFtZSB2YWx1ZXMsIHN1Y2ggYXNcbiAgICAgICAgLy8gdGhlIG5hbWVzIG9mIExheWVyc01vZGVsIGFuZCBMYXllciBpbnN0YW5jZXMsIHNob3VsZCBub3QgdW5kZXJnbyB0aGVcbiAgICAgICAgLy8gY2FtZWwtY2FzZSBjb252ZXJzaW9uLlxuICAgICAgICB0c0RpY3RbcHl0aG9uaWNLZXldID0gcHl0aG9uaWNWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRzS2V5ID0gZ2VuZXJpY191dGlscy50b0NhbWVsQ2FzZShweXRob25pY0tleSk7XG4gICAgICAgIHRzRGljdFt0c0tleV0gPSBjb252ZXJ0UHl0aG9uaWNUb1RzKHB5dGhvbmljVmFsdWUsIHRzS2V5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRzRGljdDtcbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnQgYSBUeXBlU2NyaXB0IGNvbmZpZyBvYmplY3QgdG8gUHl0aG9uIGNvbmZpZyBvYmplY3QuXG4gKiBAcGFyYW0gdHNDb25maWcgVGhlIGNvbmZpZyBvYmplY3QgdG8gY29udmVydC5cbiAqIEBwYXJhbSBrZXkgT3B0aW9uYWwga2V5IG5hbWUgb2YgdGhlIG9iamVjdCBiZWluZyBjb252ZXJ0ZWQuXG4gKiBAcmV0dXJucyBSZXN1bHQgb2YgdGhlIGNvbnZlcnNpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VHNUb1B5dGhvbmljKFxuICAgIHRzQ29uZmlnOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3RWYWx1ZSwga2V5Pzogc3RyaW5nKTogUHlKc29uVmFsdWUge1xuICBpZiAodHNDb25maWcgPT09IG51bGwgfHwgdHNDb25maWcgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB0c0NvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZ2VuZXJpY191dGlscy50b1NuYWtlQ2FzZSh0c0NvbmZpZyk7XG4gIH0gZWxzZSBpZiAoXG4gICAgICAodHlwZW9mIHRzQ29uZmlnID09PSAnbnVtYmVyJykgfHwgKHR5cGVvZiB0c0NvbmZpZyA9PT0gJ2Jvb2xlYW4nKSkge1xuICAgIHJldHVybiB0c0NvbmZpZztcbiAgfSBlbHNlIGlmICh0c0NvbmZpZyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgY29uc3QgcHlBcnJheSA9IFtdO1xuICAgIGNvbnN0IGFycmF5TGVuZ3RoID0gdHNDb25maWcubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXlMZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgaXRlbSA9IHRzQ29uZmlnW2ldO1xuICAgICAgaWYgKGlzQXJyYXlJdGVtSW5wdXRPck91dHB1dE5hbWUoa2V5LCBpLCBpdGVtKSkge1xuICAgICAgICBweUFycmF5LnB1c2goaXRlbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBweUFycmF5LnB1c2goY29udmVydFRzVG9QeXRob25pYyhpdGVtLCBrZXkpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHB5QXJyYXk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcHlEaWN0OiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3QgPSB7fTtcbiAgICBmb3IgKGNvbnN0IHRzS2V5IG9mIE9iamVjdC5rZXlzKHRzQ29uZmlnKSkge1xuICAgICAgY29uc3QgdHNWYWx1ZSA9IHRzQ29uZmlnW3RzS2V5XTtcbiAgICAgIGNvbnN0IHB5S2V5ID0gZ2VuZXJpY191dGlscy50b1NuYWtlQ2FzZSh0c0tleSk7XG4gICAgICBpZiAoKHRzS2V5ID09PSAnbmFtZScgfHwgdHNLZXkgPT09ICdjbGFzc05hbWUnKSAmJlxuICAgICAgICAgIHR5cGVvZiB0c1ZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBTcGVjaWFsIGNhc2UgdGhlICduYW1lJyBrZXkgd2l0aCBhIHN0cmluZyB2YWx1ZS4gTmFtZSB2YWx1ZXMsIHN1Y2ggYXNcbiAgICAgICAgLy8gdGhlIG5hbWVzIG9mIExheWVyc01vZGVsIGFuZCBMYXllciBpbnN0YW5jZXMsIHNob3VsZCBub3QgdW5kZXJnbyB0aGVcbiAgICAgICAgLy8gc25ha2UtY2FzZSBjb252ZXJzaW9uLlxuICAgICAgICBweURpY3RbcHlLZXldID0gdHNWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHB5RGljdFtweUtleV0gPSBjb252ZXJ0VHNUb1B5dGhvbmljKHRzVmFsdWUsIHRzS2V5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHB5RGljdDtcbiAgfVxufVxuIl19