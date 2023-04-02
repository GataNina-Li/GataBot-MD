"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floatFormatter = exports.keepSignificantDigits = exports.integerFormatter = void 0;
const leftPadding = (size) => {
    return (input) => {
        if (input.length < size) {
            return " ".repeat(size - input.length) + input;
        }
        return input;
    };
};
exports.integerFormatter = (size) => {
    const padding = leftPadding(size);
    return (integer) => padding("" + integer);
};
const { floor, log10, pow } = Math;
const numberOfDigits = (n) => floor(log10(n) + 1);
exports.keepSignificantDigits = (digits) => (value) => {
    const valueDigits = numberOfDigits(value);
    if (valueDigits > digits) {
        const extraDigits = valueDigits - digits;
        const magnitude = pow(10, extraDigits);
        return value - (value % magnitude);
    }
    return value;
};
exports.floatFormatter = (size, fractionDigits) => {
    const numberFormatter = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: fractionDigits,
        useGrouping: false,
    });
    const padding = leftPadding(size);
    return (float) => padding(numberFormatter.format(float));
};
//# sourceMappingURL=formatters.js.map