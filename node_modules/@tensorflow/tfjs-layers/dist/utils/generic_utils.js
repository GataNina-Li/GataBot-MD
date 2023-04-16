/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/* Original source: utils/generic_utils.py */
import { util } from '@tensorflow/tfjs-core';
import { AssertionError, ValueError } from '../errors';
// tslint:enable
/**
 * If `value` is an Array, equivalent to Python's `value * numValues`.
 * If `value` is not an Array, equivalent to Python's `[value] * numValues`
 */
// tslint:disable-next-line:no-any
export function pyListRepeat(value, numValues) {
    if (Array.isArray(value)) {
        // tslint:disable-next-line:no-any
        let newArray = [];
        for (let i = 0; i < numValues; i++) {
            newArray = newArray.concat(value);
        }
        return newArray;
    }
    else {
        const newArray = new Array(numValues);
        newArray.fill(value);
        return newArray;
    }
}
export function assert(val, message) {
    if (!val) {
        throw new AssertionError(message);
    }
}
/**
 * Count the number of elements of the `array` that are equal to `reference`.
 */
export function count(array, refernce) {
    let counter = 0;
    for (const item of array) {
        if (item === refernce) {
            counter++;
        }
    }
    return counter;
}
/**
 * If an array is of length 1, just return the first element. Otherwise, return
 * the full array.
 * @param tensors
 */
export function singletonOrArray(xs) {
    if (xs.length === 1) {
        return xs[0];
    }
    return xs;
}
/**
 * Normalizes a list/tensor into a list.
 *
 * If a tensor is passed, we return
 * a list of size 1 containing the tensor.
 *
 * @param x target object to be normalized.
 */
// tslint:disable-next-line:no-any
export function toList(x) {
    if (Array.isArray(x)) {
        return x;
    }
    return [x];
}
/**
 * Generate a UID for a list
 */
// tslint:disable-next-line:no-any
export function objectListUid(objs) {
    const objectList = toList(objs);
    let retVal = '';
    for (const obj of objectList) {
        if (obj.id == null) {
            throw new ValueError(`Object ${obj} passed to objectListUid without an id`);
        }
        if (retVal !== '') {
            retVal = retVal + ', ';
        }
        retVal = `${retVal}${Math.abs(obj.id)}`;
    }
    return retVal;
}
/**
 * Converts string to snake-case.
 * @param name
 */
export function toSnakeCase(name) {
    const intermediate = name.replace(/(.)([A-Z][a-z0-9]+)/g, '$1_$2');
    const insecure = intermediate.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    /*
     If the class is private the name starts with "_" which is not secure
     for creating scopes. We prefix the name with "private" in this case.
     */
    if (insecure[0] !== '_') {
        return insecure;
    }
    return 'private' + insecure;
}
export function toCamelCase(identifier) {
    // quick return for empty string or single character strings
    if (identifier.length <= 1) {
        return identifier;
    }
    // Check for the underscore indicating snake_case
    if (identifier.indexOf('_') === -1) {
        return identifier;
    }
    return identifier.replace(/[_]+(\w|$)/g, (m, p1) => p1.toUpperCase());
}
// tslint:disable-next-line:no-any
let _GLOBAL_CUSTOM_OBJECTS = {};
export function serializeKerasObject(instance) {
    if (instance === null || instance === undefined) {
        return null;
    }
    const dict = {};
    dict['className'] = instance.getClassName();
    dict['config'] = instance.getConfig();
    return dict;
}
/**
 * Replace ndarray-style scalar objects in serialization objects with numbers.
 *
 * Background: In some versions of tf.keras, certain scalar values in the HDF5
 * model save file can be serialized as: `{'type': 'ndarray', 'value': num}`,
 * where in `num` is a plain number. This method converts such serialization
 * to a `number`.
 *
 * @param config The keras-format serialization object to be processed
 *   (in place).
 */
function convertNDArrayScalarsInConfig(config) {
    if (config == null || typeof config !== 'object') {
        return;
    }
    else if (Array.isArray(config)) {
        config.forEach(configItem => convertNDArrayScalarsInConfig(configItem));
    }
    else {
        const fields = Object.keys(config);
        for (const field of fields) {
            const value = config[field];
            if (value != null && typeof value === 'object') {
                if (!Array.isArray(value) && value['type'] === 'ndarray' &&
                    typeof value['value'] === 'number') {
                    config[field] = value['value'];
                }
                else {
                    convertNDArrayScalarsInConfig(value);
                }
            }
        }
    }
}
/**
 * Deserialize a saved Keras Object
 * @param identifier either a string ID or a saved Keras dictionary
 * @param moduleObjects a list of Python class names to object constructors
 * @param customObjects a list of Python class names to object constructors
 * @param printableModuleName debug text for the object being reconstituted
 * @param fastWeightInit Optional flag to use fast weight initialization
 *   during deserialization. This is applicable to cases in which
 *   the initialization will be immediately overwritten by loaded weight
 *   values. Default: `false`.
 * @returns a TensorFlow.js Layers object
 */
// tslint:disable:no-any
export function deserializeKerasObject(identifier, moduleObjects = {}, customObjects = {}, printableModuleName = 'object', fastWeightInit = false) {
    // tslint:enable
    if (typeof identifier === 'string') {
        const functionName = identifier;
        let fn;
        if (functionName in customObjects) {
            fn = customObjects[functionName];
        }
        else if (functionName in _GLOBAL_CUSTOM_OBJECTS) {
            fn = _GLOBAL_CUSTOM_OBJECTS[functionName];
        }
        else {
            fn = moduleObjects[functionName];
            if (fn == null) {
                throw new ValueError(`Unknown ${printableModuleName}: ${identifier}. ` +
                    `This may be due to one of the following reasons:\n` +
                    `1. The ${printableModuleName} is defined in Python, in which ` +
                    `case it needs to be ported to TensorFlow.js or your JavaScript ` +
                    `code.\n` +
                    `2. The custom ${printableModuleName} is defined in JavaScript, ` +
                    `but is not registered properly with ` +
                    `tf.serialization.registerClass().`);
                // TODO(cais): Add link to tutorial page on custom layers.
            }
        }
        return fn;
    }
    else {
        // In this case we are dealing with a Keras config dictionary.
        const config = identifier;
        if (config['className'] == null || config['config'] == null) {
            throw new ValueError(`${printableModuleName}: Improper config format: ` +
                `${JSON.stringify(config)}.\n` +
                `'className' and 'config' must set.`);
        }
        const className = config['className'];
        let cls, fromConfig;
        if (className in customObjects) {
            [cls, fromConfig] = customObjects[className];
        }
        else if (className in _GLOBAL_CUSTOM_OBJECTS) {
            [cls, fromConfig] = _GLOBAL_CUSTOM_OBJECTS['className'];
        }
        else if (className in moduleObjects) {
            [cls, fromConfig] = moduleObjects[className];
        }
        if (cls == null) {
            throw new ValueError(`Unknown ${printableModuleName}: ${className}. ` +
                `This may be due to one of the following reasons:\n` +
                `1. The ${printableModuleName} is defined in Python, in which ` +
                `case it needs to be ported to TensorFlow.js or your JavaScript ` +
                `code.\n` +
                `2. The custom ${printableModuleName} is defined in JavaScript, ` +
                `but is not registered properly with ` +
                `tf.serialization.registerClass().`);
            // TODO(cais): Add link to tutorial page on custom layers.
        }
        if (fromConfig != null) {
            // Porting notes: Instead of checking to see whether fromConfig accepts
            // customObjects, we create a customObjects dictionary and tack it on to
            // config['config'] as config['config'].customObjects. Objects can use it,
            // if they want.
            // tslint:disable-next-line:no-any
            const customObjectsCombined = {};
            for (const key of Object.keys(_GLOBAL_CUSTOM_OBJECTS)) {
                customObjectsCombined[key] = _GLOBAL_CUSTOM_OBJECTS[key];
            }
            for (const key of Object.keys(customObjects)) {
                customObjectsCombined[key] = customObjects[key];
            }
            // Add the customObjects to config
            const nestedConfig = config['config'];
            nestedConfig['customObjects'] = customObjectsCombined;
            const backupCustomObjects = Object.assign({}, _GLOBAL_CUSTOM_OBJECTS);
            for (const key of Object.keys(customObjects)) {
                _GLOBAL_CUSTOM_OBJECTS[key] = customObjects[key];
            }
            convertNDArrayScalarsInConfig(config['config']);
            const returnObj = fromConfig(cls, config['config'], customObjects, fastWeightInit);
            _GLOBAL_CUSTOM_OBJECTS = Object.assign({}, backupCustomObjects);
            return returnObj;
        }
        else {
            // Then `cls` may be a function returning a class.
            // In this case by convention `config` holds
            // the kwargs of the function.
            const backupCustomObjects = Object.assign({}, _GLOBAL_CUSTOM_OBJECTS);
            for (const key of Object.keys(customObjects)) {
                _GLOBAL_CUSTOM_OBJECTS[key] = customObjects[key];
            }
            // In python this is **config['config'], for tfjs-layers we require
            // classes that use this fall-through construction method to take
            // a config interface that mimics the expansion of named parameters.
            const returnObj = new cls(config['config']);
            _GLOBAL_CUSTOM_OBJECTS = Object.assign({}, backupCustomObjects);
            return returnObj;
        }
    }
}
/**
 * Compares two numbers for sorting.
 * @param a
 * @param b
 */
export function numberCompare(a, b) {
    return (a < b) ? -1 : ((a > b) ? 1 : 0);
}
/**
 * Comparison of two numbers for reverse sorting.
 * @param a
 * @param b
 */
export function reverseNumberCompare(a, b) {
    return -1 * numberCompare(a, b);
}
/**
 * Convert a string into the corresponding DType.
 * @param dtype
 * @returns An instance of DType.
 */
export function stringToDType(dtype) {
    switch (dtype) {
        case 'float32':
            return 'float32';
        default:
            throw new ValueError(`Invalid dtype: ${dtype}`);
    }
}
/**
 * Test the element-by-element equality of two Arrays of strings.
 * @param xs First array of strings.
 * @param ys Second array of strings.
 * @returns Wether the two arrays are all equal, element by element.
 */
export function stringsEqual(xs, ys) {
    if (xs == null || ys == null) {
        return xs === ys;
    }
    if (xs.length !== ys.length) {
        return false;
    }
    for (let i = 0; i < xs.length; ++i) {
        if (xs[i] !== ys[i]) {
            return false;
        }
    }
    return true;
}
/**
 * Get the unique elements of an array.
 * @param xs Array.
 * @returns An Array consisting of the unique elements in `xs`.
 */
export function unique(xs) {
    if (xs == null) {
        return xs;
    }
    const out = [];
    // TODO(cais): Maybe improve performance by sorting.
    for (const x of xs) {
        if (out.indexOf(x) === -1) {
            out.push(x);
        }
    }
    return out;
}
/**
 * Determine if an Object is empty (i.e., does not have own properties).
 * @param obj Object
 * @returns Whether the Object is empty.
 * @throws ValueError: If object is `null` or `undefined`.
 */
export function isObjectEmpty(obj) {
    if (obj == null) {
        throw new ValueError(`Invalid value in obj: ${JSON.stringify(obj)}`);
    }
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
/**
 * Helper function used to build type union/enum run-time checkers.
 * @param values The list of allowed values.
 * @param label A string name for the type
 * @param value The value to test.
 * @throws ValueError: If the value is not in values nor `undefined`/`null`.
 */
export function checkStringTypeUnionValue(values, label, value) {
    if (value == null) {
        return;
    }
    if (values.indexOf(value) < 0) {
        throw new ValueError(`${value} is not a valid ${label}.  Valid values are ${values} or null/undefined.`);
    }
}
/**
 * Helper function for verifying the types of inputs.
 *
 * Ensures that the elements of `x` are all of type `expectedType`.
 * Also verifies that the length of `x` is within bounds.
 *
 * @param x Object to test.
 * @param expectedType The string expected type of all of the elements in the
 * Array.
 * @param minLength Return false if x.length is less than this.
 * @param maxLength Return false if x.length is greater than this.
 * @returns true if and only if `x` is an `Array<expectedType>` with
 * length >= `minLength` and <= `maxLength`.
 */
// tslint:disable:no-any
export function checkArrayTypeAndLength(x, expectedType, minLength = 0, maxLength = Infinity) {
    assert(minLength >= 0);
    assert(maxLength >= minLength);
    return (Array.isArray(x) && x.length >= minLength && x.length <= maxLength &&
        x.every(e => typeof e === expectedType));
}
// tslint:enable:no-any
/**
 * Assert that a value or an array of value are positive integer.
 *
 * @param value The value being asserted on. May be a single number or an array
 *   of numbers.
 * @param name Name of the value, used to make the error message.
 */
export function assertPositiveInteger(value, name) {
    if (Array.isArray(value)) {
        util.assert(value.length > 0, () => `${name} is unexpectedly an empty array.`);
        value.forEach((v, i) => assertPositiveInteger(v, `element ${i + 1} of ${name}`));
    }
    else {
        util.assert(Number.isInteger(value) && value > 0, () => `Expected ${name} to be a positive integer, but got ` +
            `${formatAsFriendlyString(value)}.`);
    }
}
/**
 * Format a value into a display-friendly, human-readable fashion.
 *
 * - `null` is formatted as `'null'`
 * - Strings are formated with flanking pair of quotes.
 * - Arrays are formatted with flanking pair of square brackets.
 *
 * @param value The value to display.
 * @return Formatted string.
 */
// tslint:disable-next-line:no-any
export function formatAsFriendlyString(value) {
    if (value === null) {
        return 'null';
    }
    else if (Array.isArray(value)) {
        return '[' + value.map(v => formatAsFriendlyString(v)).join(',') + ']';
    }
    else if (typeof value === 'string') {
        return `"${value}"`;
    }
    else {
        return `${value}`;
    }
}
/**
 * Returns a function `f2` (decorator) which wraps the original function
 * `f`. `f2` guarantees that `f` can be called at most once
 * every `waitMs` ms. If `f2` is called more often, it will return
 * the last returned result of `f`.
 *
 * @param f The original function `f` to wrap.
 * @param waitMs The time between two consecutive calls to `f` in ms.
 */
export function debounce(f, waitMs, nowFunc) {
    let lastTime = nowFunc != null ? nowFunc() : util.now();
    let lastResult;
    const f2 = (...args) => {
        const now = nowFunc != null ? nowFunc() : util.now();
        if (now - lastTime < waitMs) {
            return lastResult;
        }
        lastTime = now;
        lastResult = f(...args);
        return lastResult;
    };
    return f2;
}
/**
 * Returns the fusable activation given a layers identifier.
 *
 * @param activationName The layers identifier string.
 * @return The name of the fusable activation.
 */
export function mapActivationToFusedKernel(activationName) {
    if (activationName === 'relu') {
        return 'relu';
    }
    if (activationName === 'linear') {
        return 'linear';
    }
    if (activationName === 'elu') {
        return 'elu';
    }
    return null;
}
/**
 * Returns the cartesian product of sets of values.
 * This works the same as itertools.product in Python.
 *
 * Example:
 *
 * filters = [128, 256, 512]
 * paddings = ['same', 'valid']
 *
 * product = [ [128, 'same'], [128, 'valid'], [256, 'same'], [256, 'valid'],
 * [512, 'same'], [512, 'valid']]
 *
 * @param arrayOfValues List/array of values.
 * @return The cartesian product.
 */
export function getCartesianProductOfValues(...arrayOfValues) {
    assert(arrayOfValues.length > 0, 'arrayOfValues is empty');
    for (const values of arrayOfValues) {
        assert(Array.isArray(values), 'one of the values is not an array');
        assert(values.length > 0, 'one of the values is empty');
    }
    return arrayOfValues.reduce((products, values) => {
        if (products.length === 0) {
            return values.map(value => [value]);
        }
        return values
            .map(value => {
            return products.map((prevValue) => [...prevValue, value]);
        })
            .reduce((flattenedProduct, unflattenedProduct) => {
            return flattenedProduct.concat(unflattenedProduct);
        }, []);
    }, []);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJpY191dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtbGF5ZXJzL3NyYy91dGlscy9nZW5lcmljX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUgsNkNBQTZDO0FBRTdDLE9BQU8sRUFBaUMsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFM0UsT0FBTyxFQUFDLGNBQWMsRUFBRSxVQUFVLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFckQsZ0JBQWdCO0FBRWhCOzs7R0FHRztBQUNILGtDQUFrQztBQUNsQyxNQUFNLFVBQVUsWUFBWSxDQUFDLEtBQVUsRUFBRSxTQUFpQjtJQUN4RCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEIsa0NBQWtDO1FBQ2xDLElBQUksUUFBUSxHQUFVLEVBQUUsQ0FBQztRQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsT0FBTyxRQUFRLENBQUM7S0FDakI7U0FBTTtRQUNMLE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsT0FBTyxRQUFRLENBQUM7S0FDakI7QUFDSCxDQUFDO0FBRUQsTUFBTSxVQUFVLE1BQU0sQ0FBQyxHQUFZLEVBQUUsT0FBZ0I7SUFDbkQsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNSLE1BQU0sSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDbkM7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFJLEtBQVUsRUFBRSxR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QyxDQUFDO1NBQ3JDO1FBRUQsT0FBTyxNQUFNO2FBQ1IsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ1gsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDO2FBQ0QsTUFBTSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsRUFBRTtZQUMvQyxPQUFPLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3JELENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNiLENBQUMsRUFBRSxFQUFvQixDQUFDLENBQUM7QUFDM0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAqIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8qIE9yaWdpbmFsIHNvdXJjZTogdXRpbHMvZ2VuZXJpY191dGlscy5weSAqL1xuXG5pbXBvcnQge0RhdGFUeXBlLCBmdXNlZCwgc2VyaWFsaXphdGlvbiwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtBc3NlcnRpb25FcnJvciwgVmFsdWVFcnJvcn0gZnJvbSAnLi4vZXJyb3JzJztcblxuLy8gdHNsaW50OmVuYWJsZVxuXG4vKipcbiAqIElmIGB2YWx1ZWAgaXMgYW4gQXJyYXksIGVxdWl2YWxlbnQgdG8gUHl0aG9uJ3MgYHZhbHVlICogbnVtVmFsdWVzYC5cbiAqIElmIGB2YWx1ZWAgaXMgbm90IGFuIEFycmF5LCBlcXVpdmFsZW50IHRvIFB5dGhvbidzIGBbdmFsdWVdICogbnVtVmFsdWVzYFxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG5leHBvcnQgZnVuY3Rpb24gcHlMaXN0UmVwZWF0KHZhbHVlOiBhbnksIG51bVZhbHVlczogbnVtYmVyKTogYW55W10ge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgbGV0IG5ld0FycmF5OiBhbnlbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVmFsdWVzOyBpKyspIHtcbiAgICAgIG5ld0FycmF5ID0gbmV3QXJyYXkuY29uY2F0KHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG5ld0FycmF5ID0gbmV3IEFycmF5KG51bVZhbHVlcyk7XG4gICAgbmV3QXJyYXkuZmlsbCh2YWx1ZSk7XG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnQodmFsOiBib29sZWFuLCBtZXNzYWdlPzogc3RyaW5nKTogdm9pZCB7XG4gIGlmICghdmFsKSB7XG4gICAgdGhyb3cgbmV3IEFzc2VydGlvbkVycm9yKG1lc3NhZ2UpO1xuICB9XG59XG5cbi8qKlxuICogQ291bnQgdGhlIG51bWJlciBvZiBlbGVtZW50cyBvZiB0aGUgYGFycmF5YCB0aGF0IGFyZSBlcXVhbCB0byBgcmVmZXJlbmNlYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvdW50PFQ+KGFycmF5OiBUW10sIHJlZmVybmNlOiBUKSB7XG4gIGxldCBjb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGFycmF5KSB7XG4gICAgaWYgKGl0ZW0gPT09IHJlZmVybmNlKSB7XG4gICAgICBjb3VudGVyKys7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb3VudGVyO1xufVxuXG4vKipcbiAqIElmIGFuIGFycmF5IGlzIG9mIGxlbmd0aCAxLCBqdXN0IHJldHVybiB0aGUgZmlyc3QgZWxlbWVudC4gT3RoZXJ3aXNlLCByZXR1cm5cbiAqIHRoZSBmdWxsIGFycmF5LlxuICogQHBhcmFtIHRlbnNvcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNpbmdsZXRvbk9yQXJyYXk8VD4oeHM6IFRbXSk6IFR8VFtdIHtcbiAgaWYgKHhzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiB4c1swXTtcbiAgfVxuICByZXR1cm4geHM7XG59XG5cbi8qKlxuICogTm9ybWFsaXplcyBhIGxpc3QvdGVuc29yIGludG8gYSBsaXN0LlxuICpcbiAqIElmIGEgdGVuc29yIGlzIHBhc3NlZCwgd2UgcmV0dXJuXG4gKiBhIGxpc3Qgb2Ygc2l6ZSAxIGNvbnRhaW5pbmcgdGhlIHRlbnNvci5cbiAqXG4gKiBAcGFyYW0geCB0YXJnZXQgb2JqZWN0IHRvIGJlIG5vcm1hbGl6ZWQuXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbmV4cG9ydCBmdW5jdGlvbiB0b0xpc3QoeDogYW55KTogYW55W10ge1xuICBpZiAoQXJyYXkuaXNBcnJheSh4KSkge1xuICAgIHJldHVybiB4O1xuICB9XG4gIHJldHVybiBbeF07XG59XG5cbi8qKlxuICogR2VuZXJhdGUgYSBVSUQgZm9yIGEgbGlzdFxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0TGlzdFVpZChvYmpzOiBhbnl8YW55W10pOiBzdHJpbmcge1xuICBjb25zdCBvYmplY3RMaXN0ID0gdG9MaXN0KG9ianMpO1xuICBsZXQgcmV0VmFsID0gJyc7XG4gIGZvciAoY29uc3Qgb2JqIG9mIG9iamVjdExpc3QpIHtcbiAgICBpZiAob2JqLmlkID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKFxuICAgICAgICAgIGBPYmplY3QgJHtvYmp9IHBhc3NlZCB0byBvYmplY3RMaXN0VWlkIHdpdGhvdXQgYW4gaWRgKTtcbiAgICB9XG4gICAgaWYgKHJldFZhbCAhPT0gJycpIHtcbiAgICAgIHJldFZhbCA9IHJldFZhbCArICcsICc7XG4gICAgfVxuICAgIHJldFZhbCA9IGAke3JldFZhbH0ke01hdGguYWJzKG9iai5pZCl9YDtcbiAgfVxuICByZXR1cm4gcmV0VmFsO1xufVxuLyoqXG4gKiBDb252ZXJ0cyBzdHJpbmcgdG8gc25ha2UtY2FzZS5cbiAqIEBwYXJhbSBuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1NuYWtlQ2FzZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBpbnRlcm1lZGlhdGUgPSBuYW1lLnJlcGxhY2UoLyguKShbQS1aXVthLXowLTldKykvZywgJyQxXyQyJyk7XG4gIGNvbnN0IGluc2VjdXJlID1cbiAgICAgIGludGVybWVkaWF0ZS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDFfJDInKS50b0xvd2VyQ2FzZSgpO1xuICAvKlxuICAgSWYgdGhlIGNsYXNzIGlzIHByaXZhdGUgdGhlIG5hbWUgc3RhcnRzIHdpdGggXCJfXCIgd2hpY2ggaXMgbm90IHNlY3VyZVxuICAgZm9yIGNyZWF0aW5nIHNjb3Blcy4gV2UgcHJlZml4IHRoZSBuYW1lIHdpdGggXCJwcml2YXRlXCIgaW4gdGhpcyBjYXNlLlxuICAgKi9cbiAgaWYgKGluc2VjdXJlWzBdICE9PSAnXycpIHtcbiAgICByZXR1cm4gaW5zZWN1cmU7XG4gIH1cbiAgcmV0dXJuICdwcml2YXRlJyArIGluc2VjdXJlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9DYW1lbENhc2UoaWRlbnRpZmllcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gcXVpY2sgcmV0dXJuIGZvciBlbXB0eSBzdHJpbmcgb3Igc2luZ2xlIGNoYXJhY3RlciBzdHJpbmdzXG4gIGlmIChpZGVudGlmaWVyLmxlbmd0aCA8PSAxKSB7XG4gICAgcmV0dXJuIGlkZW50aWZpZXI7XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIHRoZSB1bmRlcnNjb3JlIGluZGljYXRpbmcgc25ha2VfY2FzZVxuICBpZiAoaWRlbnRpZmllci5pbmRleE9mKCdfJykgPT09IC0xKSB7XG4gICAgcmV0dXJuIGlkZW50aWZpZXI7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXIucmVwbGFjZSgvW19dKyhcXHd8JCkvZywgKG0sIHAxKSA9PiBwMS50b1VwcGVyQ2FzZSgpKTtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxubGV0IF9HTE9CQUxfQ1VTVE9NX09CSkVDVFMgPSB7fSBhcyB7W29iak5hbWU6IHN0cmluZ106IGFueX07XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVLZXJhc09iamVjdChpbnN0YW5jZTogc2VyaWFsaXphdGlvbi5TZXJpYWxpemFibGUpOlxuICAgIHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdFZhbHVlIHtcbiAgaWYgKGluc3RhbmNlID09PSBudWxsIHx8IGluc3RhbmNlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBkaWN0OiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3RWYWx1ZSA9IHt9O1xuICBkaWN0WydjbGFzc05hbWUnXSA9IGluc3RhbmNlLmdldENsYXNzTmFtZSgpO1xuICBkaWN0Wydjb25maWcnXSA9IGluc3RhbmNlLmdldENvbmZpZygpO1xuICByZXR1cm4gZGljdDtcbn1cblxuLyoqXG4gKiBSZXBsYWNlIG5kYXJyYXktc3R5bGUgc2NhbGFyIG9iamVjdHMgaW4gc2VyaWFsaXphdGlvbiBvYmplY3RzIHdpdGggbnVtYmVycy5cbiAqXG4gKiBCYWNrZ3JvdW5kOiBJbiBzb21lIHZlcnNpb25zIG9mIHRmLmtlcmFzLCBjZXJ0YWluIHNjYWxhciB2YWx1ZXMgaW4gdGhlIEhERjVcbiAqIG1vZGVsIHNhdmUgZmlsZSBjYW4gYmUgc2VyaWFsaXplZCBhczogYHsndHlwZSc6ICduZGFycmF5JywgJ3ZhbHVlJzogbnVtfWAsXG4gKiB3aGVyZSBpbiBgbnVtYCBpcyBhIHBsYWluIG51bWJlci4gVGhpcyBtZXRob2QgY29udmVydHMgc3VjaCBzZXJpYWxpemF0aW9uXG4gKiB0byBhIGBudW1iZXJgLlxuICpcbiAqIEBwYXJhbSBjb25maWcgVGhlIGtlcmFzLWZvcm1hdCBzZXJpYWxpemF0aW9uIG9iamVjdCB0byBiZSBwcm9jZXNzZWRcbiAqICAgKGluIHBsYWNlKS5cbiAqL1xuZnVuY3Rpb24gY29udmVydE5EQXJyYXlTY2FsYXJzSW5Db25maWcoY29uZmlnOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3RWYWx1ZSk6XG4gICAgdm9pZCB7XG4gIGlmIChjb25maWcgPT0gbnVsbCB8fCB0eXBlb2YgY29uZmlnICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNvbmZpZykpIHtcbiAgICBjb25maWcuZm9yRWFjaChjb25maWdJdGVtID0+IGNvbnZlcnROREFycmF5U2NhbGFyc0luQ29uZmlnKGNvbmZpZ0l0ZW0pKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBmaWVsZHMgPSBPYmplY3Qua2V5cyhjb25maWcpO1xuICAgIGZvciAoY29uc3QgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbmZpZ1tmaWVsZF07XG4gICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWVbJ3R5cGUnXSA9PT0gJ25kYXJyYXknICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWVbJ3ZhbHVlJ10gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgY29uZmlnW2ZpZWxkXSA9IHZhbHVlWyd2YWx1ZSddO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnZlcnROREFycmF5U2NhbGFyc0luQ29uZmlnKHZhbHVlIGFzIHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEZXNlcmlhbGl6ZSBhIHNhdmVkIEtlcmFzIE9iamVjdFxuICogQHBhcmFtIGlkZW50aWZpZXIgZWl0aGVyIGEgc3RyaW5nIElEIG9yIGEgc2F2ZWQgS2VyYXMgZGljdGlvbmFyeVxuICogQHBhcmFtIG1vZHVsZU9iamVjdHMgYSBsaXN0IG9mIFB5dGhvbiBjbGFzcyBuYW1lcyB0byBvYmplY3QgY29uc3RydWN0b3JzXG4gKiBAcGFyYW0gY3VzdG9tT2JqZWN0cyBhIGxpc3Qgb2YgUHl0aG9uIGNsYXNzIG5hbWVzIHRvIG9iamVjdCBjb25zdHJ1Y3RvcnNcbiAqIEBwYXJhbSBwcmludGFibGVNb2R1bGVOYW1lIGRlYnVnIHRleHQgZm9yIHRoZSBvYmplY3QgYmVpbmcgcmVjb25zdGl0dXRlZFxuICogQHBhcmFtIGZhc3RXZWlnaHRJbml0IE9wdGlvbmFsIGZsYWcgdG8gdXNlIGZhc3Qgd2VpZ2h0IGluaXRpYWxpemF0aW9uXG4gKiAgIGR1cmluZyBkZXNlcmlhbGl6YXRpb24uIFRoaXMgaXMgYXBwbGljYWJsZSB0byBjYXNlcyBpbiB3aGljaFxuICogICB0aGUgaW5pdGlhbGl6YXRpb24gd2lsbCBiZSBpbW1lZGlhdGVseSBvdmVyd3JpdHRlbiBieSBsb2FkZWQgd2VpZ2h0XG4gKiAgIHZhbHVlcy4gRGVmYXVsdDogYGZhbHNlYC5cbiAqIEByZXR1cm5zIGEgVGVuc29yRmxvdy5qcyBMYXllcnMgb2JqZWN0XG4gKi9cbi8vIHRzbGludDpkaXNhYmxlOm5vLWFueVxuZXhwb3J0IGZ1bmN0aW9uIGRlc2VyaWFsaXplS2VyYXNPYmplY3QoXG4gICAgaWRlbnRpZmllcjogc3RyaW5nfHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCxcbiAgICBtb2R1bGVPYmplY3RzID0ge30gYXMge1tvYmpOYW1lOiBzdHJpbmddOiBhbnl9LFxuICAgIGN1c3RvbU9iamVjdHMgPSB7fSBhcyB7W29iak5hbWU6IHN0cmluZ106IGFueX0sXG4gICAgcHJpbnRhYmxlTW9kdWxlTmFtZSA9ICdvYmplY3QnLCBmYXN0V2VpZ2h0SW5pdCA9IGZhbHNlKTogYW55IHtcbiAgLy8gdHNsaW50OmVuYWJsZVxuICBpZiAodHlwZW9mIGlkZW50aWZpZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgZnVuY3Rpb25OYW1lID0gaWRlbnRpZmllcjtcbiAgICBsZXQgZm47XG4gICAgaWYgKGZ1bmN0aW9uTmFtZSBpbiBjdXN0b21PYmplY3RzKSB7XG4gICAgICBmbiA9IGN1c3RvbU9iamVjdHNbZnVuY3Rpb25OYW1lXTtcbiAgICB9IGVsc2UgaWYgKGZ1bmN0aW9uTmFtZSBpbiBfR0xPQkFMX0NVU1RPTV9PQkpFQ1RTKSB7XG4gICAgICBmbiA9IF9HTE9CQUxfQ1VTVE9NX09CSkVDVFNbZnVuY3Rpb25OYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm4gPSBtb2R1bGVPYmplY3RzW2Z1bmN0aW9uTmFtZV07XG4gICAgICBpZiAoZm4gPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICAgIGBVbmtub3duICR7cHJpbnRhYmxlTW9kdWxlTmFtZX06ICR7aWRlbnRpZmllcn0uIGAgK1xuICAgICAgICAgICAgYFRoaXMgbWF5IGJlIGR1ZSB0byBvbmUgb2YgdGhlIGZvbGxvd2luZyByZWFzb25zOlxcbmAgK1xuICAgICAgICAgICAgYDEuIFRoZSAke3ByaW50YWJsZU1vZHVsZU5hbWV9IGlzIGRlZmluZWQgaW4gUHl0aG9uLCBpbiB3aGljaCBgICtcbiAgICAgICAgICAgIGBjYXNlIGl0IG5lZWRzIHRvIGJlIHBvcnRlZCB0byBUZW5zb3JGbG93LmpzIG9yIHlvdXIgSmF2YVNjcmlwdCBgICtcbiAgICAgICAgICAgIGBjb2RlLlxcbmAgK1xuICAgICAgICAgICAgYDIuIFRoZSBjdXN0b20gJHtwcmludGFibGVNb2R1bGVOYW1lfSBpcyBkZWZpbmVkIGluIEphdmFTY3JpcHQsIGAgK1xuICAgICAgICAgICAgYGJ1dCBpcyBub3QgcmVnaXN0ZXJlZCBwcm9wZXJseSB3aXRoIGAgK1xuICAgICAgICAgICAgYHRmLnNlcmlhbGl6YXRpb24ucmVnaXN0ZXJDbGFzcygpLmApO1xuICAgICAgICAvLyBUT0RPKGNhaXMpOiBBZGQgbGluayB0byB0dXRvcmlhbCBwYWdlIG9uIGN1c3RvbSBsYXllcnMuXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmbjtcbiAgfSBlbHNlIHtcbiAgICAvLyBJbiB0aGlzIGNhc2Ugd2UgYXJlIGRlYWxpbmcgd2l0aCBhIEtlcmFzIGNvbmZpZyBkaWN0aW9uYXJ5LlxuICAgIGNvbnN0IGNvbmZpZyA9IGlkZW50aWZpZXI7XG4gICAgaWYgKGNvbmZpZ1snY2xhc3NOYW1lJ10gPT0gbnVsbCB8fCBjb25maWdbJ2NvbmZpZyddID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKFxuICAgICAgICAgIGAke3ByaW50YWJsZU1vZHVsZU5hbWV9OiBJbXByb3BlciBjb25maWcgZm9ybWF0OiBgICtcbiAgICAgICAgICBgJHtKU09OLnN0cmluZ2lmeShjb25maWcpfS5cXG5gICtcbiAgICAgICAgICBgJ2NsYXNzTmFtZScgYW5kICdjb25maWcnIG11c3Qgc2V0LmApO1xuICAgIH1cbiAgICBjb25zdCBjbGFzc05hbWUgPSBjb25maWdbJ2NsYXNzTmFtZSddIGFzIHN0cmluZztcbiAgICBsZXQgY2xzLCBmcm9tQ29uZmlnO1xuICAgIGlmIChjbGFzc05hbWUgaW4gY3VzdG9tT2JqZWN0cykge1xuICAgICAgW2NscywgZnJvbUNvbmZpZ10gPSBjdXN0b21PYmplY3RzW2NsYXNzTmFtZV07XG4gICAgfSBlbHNlIGlmIChjbGFzc05hbWUgaW4gX0dMT0JBTF9DVVNUT01fT0JKRUNUUykge1xuICAgICAgW2NscywgZnJvbUNvbmZpZ10gPSBfR0xPQkFMX0NVU1RPTV9PQkpFQ1RTWydjbGFzc05hbWUnXTtcbiAgICB9IGVsc2UgaWYgKGNsYXNzTmFtZSBpbiBtb2R1bGVPYmplY3RzKSB7XG4gICAgICBbY2xzLCBmcm9tQ29uZmlnXSA9IG1vZHVsZU9iamVjdHNbY2xhc3NOYW1lXTtcbiAgICB9XG4gICAgaWYgKGNscyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICBgVW5rbm93biAke3ByaW50YWJsZU1vZHVsZU5hbWV9OiAke2NsYXNzTmFtZX0uIGAgK1xuICAgICAgICAgIGBUaGlzIG1heSBiZSBkdWUgdG8gb25lIG9mIHRoZSBmb2xsb3dpbmcgcmVhc29uczpcXG5gICtcbiAgICAgICAgICBgMS4gVGhlICR7cHJpbnRhYmxlTW9kdWxlTmFtZX0gaXMgZGVmaW5lZCBpbiBQeXRob24sIGluIHdoaWNoIGAgK1xuICAgICAgICAgIGBjYXNlIGl0IG5lZWRzIHRvIGJlIHBvcnRlZCB0byBUZW5zb3JGbG93LmpzIG9yIHlvdXIgSmF2YVNjcmlwdCBgICtcbiAgICAgICAgICBgY29kZS5cXG5gICtcbiAgICAgICAgICBgMi4gVGhlIGN1c3RvbSAke3ByaW50YWJsZU1vZHVsZU5hbWV9IGlzIGRlZmluZWQgaW4gSmF2YVNjcmlwdCwgYCArXG4gICAgICAgICAgYGJ1dCBpcyBub3QgcmVnaXN0ZXJlZCBwcm9wZXJseSB3aXRoIGAgK1xuICAgICAgICAgIGB0Zi5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoKS5gKTtcbiAgICAgIC8vIFRPRE8oY2Fpcyk6IEFkZCBsaW5rIHRvIHR1dG9yaWFsIHBhZ2Ugb24gY3VzdG9tIGxheWVycy5cbiAgICB9XG4gICAgaWYgKGZyb21Db25maWcgIT0gbnVsbCkge1xuICAgICAgLy8gUG9ydGluZyBub3RlczogSW5zdGVhZCBvZiBjaGVja2luZyB0byBzZWUgd2hldGhlciBmcm9tQ29uZmlnIGFjY2VwdHNcbiAgICAgIC8vIGN1c3RvbU9iamVjdHMsIHdlIGNyZWF0ZSBhIGN1c3RvbU9iamVjdHMgZGljdGlvbmFyeSBhbmQgdGFjayBpdCBvbiB0b1xuICAgICAgLy8gY29uZmlnWydjb25maWcnXSBhcyBjb25maWdbJ2NvbmZpZyddLmN1c3RvbU9iamVjdHMuIE9iamVjdHMgY2FuIHVzZSBpdCxcbiAgICAgIC8vIGlmIHRoZXkgd2FudC5cblxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgY29uc3QgY3VzdG9tT2JqZWN0c0NvbWJpbmVkID0ge30gYXMge1tvYmpOYW1lOiBzdHJpbmddOiBhbnl9O1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoX0dMT0JBTF9DVVNUT01fT0JKRUNUUykpIHtcbiAgICAgICAgY3VzdG9tT2JqZWN0c0NvbWJpbmVkW2tleV0gPSBfR0xPQkFMX0NVU1RPTV9PQkpFQ1RTW2tleV07XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhjdXN0b21PYmplY3RzKSkge1xuICAgICAgICBjdXN0b21PYmplY3RzQ29tYmluZWRba2V5XSA9IGN1c3RvbU9iamVjdHNba2V5XTtcbiAgICAgIH1cbiAgICAgIC8vIEFkZCB0aGUgY3VzdG9tT2JqZWN0cyB0byBjb25maWdcbiAgICAgIGNvbnN0IG5lc3RlZENvbmZpZyA9IGNvbmZpZ1snY29uZmlnJ10gYXMgc2VyaWFsaXphdGlvbi5Db25maWdEaWN0O1xuICAgICAgbmVzdGVkQ29uZmlnWydjdXN0b21PYmplY3RzJ10gPSBjdXN0b21PYmplY3RzQ29tYmluZWQ7XG5cbiAgICAgIGNvbnN0IGJhY2t1cEN1c3RvbU9iamVjdHMgPSB7Li4uX0dMT0JBTF9DVVNUT01fT0JKRUNUU307XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhjdXN0b21PYmplY3RzKSkge1xuICAgICAgICBfR0xPQkFMX0NVU1RPTV9PQkpFQ1RTW2tleV0gPSBjdXN0b21PYmplY3RzW2tleV07XG4gICAgICB9XG4gICAgICBjb252ZXJ0TkRBcnJheVNjYWxhcnNJbkNvbmZpZyhjb25maWdbJ2NvbmZpZyddKTtcbiAgICAgIGNvbnN0IHJldHVybk9iaiA9XG4gICAgICAgICAgZnJvbUNvbmZpZyhjbHMsIGNvbmZpZ1snY29uZmlnJ10sIGN1c3RvbU9iamVjdHMsIGZhc3RXZWlnaHRJbml0KTtcbiAgICAgIF9HTE9CQUxfQ1VTVE9NX09CSkVDVFMgPSB7Li4uYmFja3VwQ3VzdG9tT2JqZWN0c307XG5cbiAgICAgIHJldHVybiByZXR1cm5PYmo7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZW4gYGNsc2AgbWF5IGJlIGEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgY2xhc3MuXG4gICAgICAvLyBJbiB0aGlzIGNhc2UgYnkgY29udmVudGlvbiBgY29uZmlnYCBob2xkc1xuICAgICAgLy8gdGhlIGt3YXJncyBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICBjb25zdCBiYWNrdXBDdXN0b21PYmplY3RzID0gey4uLl9HTE9CQUxfQ1VTVE9NX09CSkVDVFN9O1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoY3VzdG9tT2JqZWN0cykpIHtcbiAgICAgICAgX0dMT0JBTF9DVVNUT01fT0JKRUNUU1trZXldID0gY3VzdG9tT2JqZWN0c1trZXldO1xuICAgICAgfVxuICAgICAgLy8gSW4gcHl0aG9uIHRoaXMgaXMgKipjb25maWdbJ2NvbmZpZyddLCBmb3IgdGZqcy1sYXllcnMgd2UgcmVxdWlyZVxuICAgICAgLy8gY2xhc3NlcyB0aGF0IHVzZSB0aGlzIGZhbGwtdGhyb3VnaCBjb25zdHJ1Y3Rpb24gbWV0aG9kIHRvIHRha2VcbiAgICAgIC8vIGEgY29uZmlnIGludGVyZmFjZSB0aGF0IG1pbWljcyB0aGUgZXhwYW5zaW9uIG9mIG5hbWVkIHBhcmFtZXRlcnMuXG4gICAgICBjb25zdCByZXR1cm5PYmogPSBuZXcgY2xzKGNvbmZpZ1snY29uZmlnJ10pO1xuICAgICAgX0dMT0JBTF9DVVNUT01fT0JKRUNUUyA9IHsuLi5iYWNrdXBDdXN0b21PYmplY3RzfTtcbiAgICAgIHJldHVybiByZXR1cm5PYmo7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ29tcGFyZXMgdHdvIG51bWJlcnMgZm9yIHNvcnRpbmcuXG4gKiBAcGFyYW0gYVxuICogQHBhcmFtIGJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG51bWJlckNvbXBhcmUoYTogbnVtYmVyLCBiOiBudW1iZXIpIHtcbiAgcmV0dXJuIChhIDwgYikgPyAtMSA6ICgoYSA+IGIpID8gMSA6IDApO1xufVxuXG4vKipcbiAqIENvbXBhcmlzb24gb2YgdHdvIG51bWJlcnMgZm9yIHJldmVyc2Ugc29ydGluZy5cbiAqIEBwYXJhbSBhXG4gKiBAcGFyYW0gYlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmV2ZXJzZU51bWJlckNvbXBhcmUoYTogbnVtYmVyLCBiOiBudW1iZXIpIHtcbiAgcmV0dXJuIC0xICogbnVtYmVyQ29tcGFyZShhLCBiKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgc3RyaW5nIGludG8gdGhlIGNvcnJlc3BvbmRpbmcgRFR5cGUuXG4gKiBAcGFyYW0gZHR5cGVcbiAqIEByZXR1cm5zIEFuIGluc3RhbmNlIG9mIERUeXBlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nVG9EVHlwZShkdHlwZTogc3RyaW5nKTogRGF0YVR5cGUge1xuICBzd2l0Y2ggKGR0eXBlKSB7XG4gICAgY2FzZSAnZmxvYXQzMic6XG4gICAgICByZXR1cm4gJ2Zsb2F0MzInO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihgSW52YWxpZCBkdHlwZTogJHtkdHlwZX1gKTtcbiAgfVxufVxuXG4vKipcbiAqIFRlc3QgdGhlIGVsZW1lbnQtYnktZWxlbWVudCBlcXVhbGl0eSBvZiB0d28gQXJyYXlzIG9mIHN0cmluZ3MuXG4gKiBAcGFyYW0geHMgRmlyc3QgYXJyYXkgb2Ygc3RyaW5ncy5cbiAqIEBwYXJhbSB5cyBTZWNvbmQgYXJyYXkgb2Ygc3RyaW5ncy5cbiAqIEByZXR1cm5zIFdldGhlciB0aGUgdHdvIGFycmF5cyBhcmUgYWxsIGVxdWFsLCBlbGVtZW50IGJ5IGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdzRXF1YWwoeHM6IHN0cmluZ1tdLCB5czogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgaWYgKHhzID09IG51bGwgfHwgeXMgPT0gbnVsbCkge1xuICAgIHJldHVybiB4cyA9PT0geXM7XG4gIH1cbiAgaWYgKHhzLmxlbmd0aCAhPT0geXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeHMubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoeHNbaV0gIT09IHlzW2ldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdldCB0aGUgdW5pcXVlIGVsZW1lbnRzIG9mIGFuIGFycmF5LlxuICogQHBhcmFtIHhzIEFycmF5LlxuICogQHJldHVybnMgQW4gQXJyYXkgY29uc2lzdGluZyBvZiB0aGUgdW5pcXVlIGVsZW1lbnRzIGluIGB4c2AuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWU8VD4oeHM6IFRbXSk6IFRbXSB7XG4gIGlmICh4cyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHhzO1xuICB9XG4gIGNvbnN0IG91dDogVFtdID0gW107XG4gIC8vIFRPRE8oY2Fpcyk6IE1heWJlIGltcHJvdmUgcGVyZm9ybWFuY2UgYnkgc29ydGluZy5cbiAgZm9yIChjb25zdCB4IG9mIHhzKSB7XG4gICAgaWYgKG91dC5pbmRleE9mKHgpID09PSAtMSkge1xuICAgICAgb3V0LnB1c2goeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGFuIE9iamVjdCBpcyBlbXB0eSAoaS5lLiwgZG9lcyBub3QgaGF2ZSBvd24gcHJvcGVydGllcykuXG4gKiBAcGFyYW0gb2JqIE9iamVjdFxuICogQHJldHVybnMgV2hldGhlciB0aGUgT2JqZWN0IGlzIGVtcHR5LlxuICogQHRocm93cyBWYWx1ZUVycm9yOiBJZiBvYmplY3QgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3RFbXB0eShvYmo6IHt9KTogYm9vbGVhbiB7XG4gIGlmIChvYmogPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKGBJbnZhbGlkIHZhbHVlIGluIG9iajogJHtKU09OLnN0cmluZ2lmeShvYmopfWApO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdXNlZCB0byBidWlsZCB0eXBlIHVuaW9uL2VudW0gcnVuLXRpbWUgY2hlY2tlcnMuXG4gKiBAcGFyYW0gdmFsdWVzIFRoZSBsaXN0IG9mIGFsbG93ZWQgdmFsdWVzLlxuICogQHBhcmFtIGxhYmVsIEEgc3RyaW5nIG5hbWUgZm9yIHRoZSB0eXBlXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3QuXG4gKiBAdGhyb3dzIFZhbHVlRXJyb3I6IElmIHRoZSB2YWx1ZSBpcyBub3QgaW4gdmFsdWVzIG5vciBgdW5kZWZpbmVkYC9gbnVsbGAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1N0cmluZ1R5cGVVbmlvblZhbHVlKFxuICAgIHZhbHVlczogc3RyaW5nW10sIGxhYmVsOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHZhbHVlcy5pbmRleE9mKHZhbHVlKSA8IDApIHtcbiAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihgJHt2YWx1ZX0gaXMgbm90IGEgdmFsaWQgJHtsYWJlbH0uICBWYWxpZCB2YWx1ZXMgYXJlICR7XG4gICAgICAgIHZhbHVlc30gb3IgbnVsbC91bmRlZmluZWQuYCk7XG4gIH1cbn1cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gZm9yIHZlcmlmeWluZyB0aGUgdHlwZXMgb2YgaW5wdXRzLlxuICpcbiAqIEVuc3VyZXMgdGhhdCB0aGUgZWxlbWVudHMgb2YgYHhgIGFyZSBhbGwgb2YgdHlwZSBgZXhwZWN0ZWRUeXBlYC5cbiAqIEFsc28gdmVyaWZpZXMgdGhhdCB0aGUgbGVuZ3RoIG9mIGB4YCBpcyB3aXRoaW4gYm91bmRzLlxuICpcbiAqIEBwYXJhbSB4IE9iamVjdCB0byB0ZXN0LlxuICogQHBhcmFtIGV4cGVjdGVkVHlwZSBUaGUgc3RyaW5nIGV4cGVjdGVkIHR5cGUgb2YgYWxsIG9mIHRoZSBlbGVtZW50cyBpbiB0aGVcbiAqIEFycmF5LlxuICogQHBhcmFtIG1pbkxlbmd0aCBSZXR1cm4gZmFsc2UgaWYgeC5sZW5ndGggaXMgbGVzcyB0aGFuIHRoaXMuXG4gKiBAcGFyYW0gbWF4TGVuZ3RoIFJldHVybiBmYWxzZSBpZiB4Lmxlbmd0aCBpcyBncmVhdGVyIHRoYW4gdGhpcy5cbiAqIEByZXR1cm5zIHRydWUgaWYgYW5kIG9ubHkgaWYgYHhgIGlzIGFuIGBBcnJheTxleHBlY3RlZFR5cGU+YCB3aXRoXG4gKiBsZW5ndGggPj0gYG1pbkxlbmd0aGAgYW5kIDw9IGBtYXhMZW5ndGhgLlxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnlcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0FycmF5VHlwZUFuZExlbmd0aChcbiAgICB4OiBhbnksIGV4cGVjdGVkVHlwZTogc3RyaW5nLCBtaW5MZW5ndGggPSAwLFxuICAgIG1heExlbmd0aCA9IEluZmluaXR5KTogYm9vbGVhbiB7XG4gIGFzc2VydChtaW5MZW5ndGggPj0gMCk7XG4gIGFzc2VydChtYXhMZW5ndGggPj0gbWluTGVuZ3RoKTtcbiAgcmV0dXJuIChcbiAgICAgIEFycmF5LmlzQXJyYXkoeCkgJiYgeC5sZW5ndGggPj0gbWluTGVuZ3RoICYmIHgubGVuZ3RoIDw9IG1heExlbmd0aCAmJlxuICAgICAgeC5ldmVyeShlID0+IHR5cGVvZiBlID09PSBleHBlY3RlZFR5cGUpKTtcbn1cbi8vIHRzbGludDplbmFibGU6bm8tYW55XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgYSB2YWx1ZSBvciBhbiBhcnJheSBvZiB2YWx1ZSBhcmUgcG9zaXRpdmUgaW50ZWdlci5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIGJlaW5nIGFzc2VydGVkIG9uLiBNYXkgYmUgYSBzaW5nbGUgbnVtYmVyIG9yIGFuIGFycmF5XG4gKiAgIG9mIG51bWJlcnMuXG4gKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSB2YWx1ZSwgdXNlZCB0byBtYWtlIHRoZSBlcnJvciBtZXNzYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0UG9zaXRpdmVJbnRlZ2VyKHZhbHVlOiBudW1iZXJ8bnVtYmVyW10sIG5hbWU6IHN0cmluZykge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICB1dGlsLmFzc2VydChcbiAgICAgICAgdmFsdWUubGVuZ3RoID4gMCwgKCkgPT4gYCR7bmFtZX0gaXMgdW5leHBlY3RlZGx5IGFuIGVtcHR5IGFycmF5LmApO1xuICAgIHZhbHVlLmZvckVhY2goXG4gICAgICAgICh2LCBpKSA9PiBhc3NlcnRQb3NpdGl2ZUludGVnZXIodiwgYGVsZW1lbnQgJHtpICsgMX0gb2YgJHtuYW1lfWApKTtcbiAgfSBlbHNlIHtcbiAgICB1dGlsLmFzc2VydChcbiAgICAgICAgTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkgJiYgdmFsdWUgPiAwLFxuICAgICAgICAoKSA9PiBgRXhwZWN0ZWQgJHtuYW1lfSB0byBiZSBhIHBvc2l0aXZlIGludGVnZXIsIGJ1dCBnb3QgYCArXG4gICAgICAgICAgICBgJHtmb3JtYXRBc0ZyaWVuZGx5U3RyaW5nKHZhbHVlKX0uYCk7XG4gIH1cbn1cblxuLyoqXG4gKiBGb3JtYXQgYSB2YWx1ZSBpbnRvIGEgZGlzcGxheS1mcmllbmRseSwgaHVtYW4tcmVhZGFibGUgZmFzaGlvbi5cbiAqXG4gKiAtIGBudWxsYCBpcyBmb3JtYXR0ZWQgYXMgYCdudWxsJ2BcbiAqIC0gU3RyaW5ncyBhcmUgZm9ybWF0ZWQgd2l0aCBmbGFua2luZyBwYWlyIG9mIHF1b3Rlcy5cbiAqIC0gQXJyYXlzIGFyZSBmb3JtYXR0ZWQgd2l0aCBmbGFua2luZyBwYWlyIG9mIHNxdWFyZSBicmFja2V0cy5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGRpc3BsYXkuXG4gKiBAcmV0dXJuIEZvcm1hdHRlZCBzdHJpbmcuXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRBc0ZyaWVuZGx5U3RyaW5nKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuICdbJyArIHZhbHVlLm1hcCh2ID0+IGZvcm1hdEFzRnJpZW5kbHlTdHJpbmcodikpLmpvaW4oJywnKSArICddJztcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGBcIiR7dmFsdWV9XCJgO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgJHt2YWx1ZX1gO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIGBmMmAgKGRlY29yYXRvcikgd2hpY2ggd3JhcHMgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uXG4gKiBgZmAuIGBmMmAgZ3VhcmFudGVlcyB0aGF0IGBmYCBjYW4gYmUgY2FsbGVkIGF0IG1vc3Qgb25jZVxuICogZXZlcnkgYHdhaXRNc2AgbXMuIElmIGBmMmAgaXMgY2FsbGVkIG1vcmUgb2Z0ZW4sIGl0IHdpbGwgcmV0dXJuXG4gKiB0aGUgbGFzdCByZXR1cm5lZCByZXN1bHQgb2YgYGZgLlxuICpcbiAqIEBwYXJhbSBmIFRoZSBvcmlnaW5hbCBmdW5jdGlvbiBgZmAgdG8gd3JhcC5cbiAqIEBwYXJhbSB3YWl0TXMgVGhlIHRpbWUgYmV0d2VlbiB0d28gY29uc2VjdXRpdmUgY2FsbHMgdG8gYGZgIGluIG1zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2U8VD4oXG4gICAgZjogKC4uLmFyZ3M6IEFycmF5PHt9PikgPT4gVCwgd2FpdE1zOiBudW1iZXIsXG4gICAgbm93RnVuYz86IEZ1bmN0aW9uKTogKC4uLmFyZ3M6IEFycmF5PHt9PikgPT4gVCB7XG4gIGxldCBsYXN0VGltZSA9IG5vd0Z1bmMgIT0gbnVsbCA/IG5vd0Z1bmMoKSA6IHV0aWwubm93KCk7XG4gIGxldCBsYXN0UmVzdWx0OiBUO1xuICBjb25zdCBmMiA9ICguLi5hcmdzOiBBcnJheTx7fT4pID0+IHtcbiAgICBjb25zdCBub3cgPSBub3dGdW5jICE9IG51bGwgPyBub3dGdW5jKCkgOiB1dGlsLm5vdygpO1xuICAgIGlmIChub3cgLSBsYXN0VGltZSA8IHdhaXRNcykge1xuICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XG4gICAgfVxuICAgIGxhc3RUaW1lID0gbm93O1xuICAgIGxhc3RSZXN1bHQgPSBmKC4uLmFyZ3MpO1xuICAgIHJldHVybiBsYXN0UmVzdWx0O1xuICB9O1xuICByZXR1cm4gZjI7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZnVzYWJsZSBhY3RpdmF0aW9uIGdpdmVuIGEgbGF5ZXJzIGlkZW50aWZpZXIuXG4gKlxuICogQHBhcmFtIGFjdGl2YXRpb25OYW1lIFRoZSBsYXllcnMgaWRlbnRpZmllciBzdHJpbmcuXG4gKiBAcmV0dXJuIFRoZSBuYW1lIG9mIHRoZSBmdXNhYmxlIGFjdGl2YXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBBY3RpdmF0aW9uVG9GdXNlZEtlcm5lbChhY3RpdmF0aW9uTmFtZTogc3RyaW5nKTpcbiAgICBmdXNlZC5BY3RpdmF0aW9uIHtcbiAgaWYgKGFjdGl2YXRpb25OYW1lID09PSAncmVsdScpIHtcbiAgICByZXR1cm4gJ3JlbHUnO1xuICB9XG4gIGlmIChhY3RpdmF0aW9uTmFtZSA9PT0gJ2xpbmVhcicpIHtcbiAgICByZXR1cm4gJ2xpbmVhcic7XG4gIH1cbiAgaWYgKGFjdGl2YXRpb25OYW1lID09PSAnZWx1Jykge1xuICAgIHJldHVybiAnZWx1JztcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxudHlwZSBQb3NzaWJsZVZhbHVlcyA9IEFycmF5PEFycmF5PGJvb2xlYW58c3RyaW5nfG51bWJlcj4+O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGNhcnRlc2lhbiBwcm9kdWN0IG9mIHNldHMgb2YgdmFsdWVzLlxuICogVGhpcyB3b3JrcyB0aGUgc2FtZSBhcyBpdGVydG9vbHMucHJvZHVjdCBpbiBQeXRob24uXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBmaWx0ZXJzID0gWzEyOCwgMjU2LCA1MTJdXG4gKiBwYWRkaW5ncyA9IFsnc2FtZScsICd2YWxpZCddXG4gKlxuICogcHJvZHVjdCA9IFsgWzEyOCwgJ3NhbWUnXSwgWzEyOCwgJ3ZhbGlkJ10sIFsyNTYsICdzYW1lJ10sIFsyNTYsICd2YWxpZCddLFxuICogWzUxMiwgJ3NhbWUnXSwgWzUxMiwgJ3ZhbGlkJ11dXG4gKlxuICogQHBhcmFtIGFycmF5T2ZWYWx1ZXMgTGlzdC9hcnJheSBvZiB2YWx1ZXMuXG4gKiBAcmV0dXJuIFRoZSBjYXJ0ZXNpYW4gcHJvZHVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENhcnRlc2lhblByb2R1Y3RPZlZhbHVlcyguLi5hcnJheU9mVmFsdWVzOiBQb3NzaWJsZVZhbHVlcyk6XG4gICAgUG9zc2libGVWYWx1ZXMge1xuICBhc3NlcnQoYXJyYXlPZlZhbHVlcy5sZW5ndGggPiAwLCAnYXJyYXlPZlZhbHVlcyBpcyBlbXB0eScpO1xuXG4gIGZvciAoY29uc3QgdmFsdWVzIG9mIGFycmF5T2ZWYWx1ZXMpIHtcbiAgICBhc3NlcnQoQXJyYXkuaXNBcnJheSh2YWx1ZXMpLCAnb25lIG9mIHRoZSB2YWx1ZXMgaXMgbm90IGFuIGFycmF5Jyk7XG4gICAgYXNzZXJ0KHZhbHVlcy5sZW5ndGggPiAwLCAnb25lIG9mIHRoZSB2YWx1ZXMgaXMgZW1wdHknKTtcbiAgfVxuXG4gIHJldHVybiBhcnJheU9mVmFsdWVzLnJlZHVjZSgocHJvZHVjdHMsIHZhbHVlcykgPT4ge1xuICAgIGlmIChwcm9kdWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZXMubWFwKHZhbHVlID0+IFt2YWx1ZV0pO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZXNcbiAgICAgICAgLm1hcCh2YWx1ZSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByb2R1Y3RzLm1hcCgocHJldlZhbHVlKSA9PiBbLi4ucHJldlZhbHVlLCB2YWx1ZV0pO1xuICAgICAgICB9KVxuICAgICAgICAucmVkdWNlKChmbGF0dGVuZWRQcm9kdWN0LCB1bmZsYXR0ZW5lZFByb2R1Y3QpID0+IHtcbiAgICAgICAgICByZXR1cm4gZmxhdHRlbmVkUHJvZHVjdC5jb25jYXQodW5mbGF0dGVuZWRQcm9kdWN0KTtcbiAgICAgICAgfSwgW10pO1xuICB9LCBbXSBhcyBQb3NzaWJsZVZhbHVlcyk7XG59XG4iXX0=