/*! multi-integer-range (c) 2015 Soichiro Miki */
"use strict";
var MultiRange = (function () {
    /**
     * Creates a new MultiRange object.
     */
    function MultiRange(data) {
        function isArray(x) {
            return Object.prototype.toString.call(x) === '[object Array]';
        }
        this.ranges = [];
        if (typeof data === 'string') {
            this.parseString(data);
        }
        else if (typeof data === 'number') {
            this.appendRange(data, data);
        }
        else if (data instanceof MultiRange) {
            this.ranges = data.getRanges();
        }
        else if (isArray(data)) {
            for (var _i = 0, _a = data; _i < _a.length; _i++) {
                var item = _a[_i];
                if (isArray(item)) {
                    if (item.length === 2) {
                        this.appendRange(item[0], item[1]);
                    }
                    else {
                        throw new TypeError('Invalid array initializer');
                    }
                }
                else if (typeof item === 'number') {
                    this.append(item);
                }
                else {
                    throw new TypeError('Invalid array initialzer');
                }
            }
        }
        else if (data !== undefined) {
            throw new TypeError('Invalid input');
        }
    }
    /**
     * Parses the initialize string and build the range data.
     * Override this if you need to customize the parsing strategy.
     */
    MultiRange.prototype.parseString = function (data) {
        function toInt(str) {
            var m = str.match(/^\(?(\-?\d+)/);
            return parseInt(m[1], 10);
        }
        var s = data.replace(/\s/g, '');
        if (!s.length)
            return;
        var match;
        for (var _i = 0, _a = s.split(','); _i < _a.length; _i++) {
            var r = _a[_i];
            if (match = r.match(/^(\d+|\(\-?\d+\))$/)) {
                var val = toInt(match[1]);
                this.appendRange(val, val);
            }
            else if (match = r.match(/^(\d+|\(\-?\d+\))?\-(\d+|\(\-?\d+\))?$/)) {
                var min = match[1] === undefined ? -Infinity : toInt(match[1]);
                var max = match[2] === undefined ? +Infinity : toInt(match[2]);
                this.appendRange(min, max);
            }
            else {
                throw new SyntaxError('Invalid input');
            }
        }
        ;
    };
    /**
     * Clones this instance.
     */
    MultiRange.prototype.clone = function () {
        return new MultiRange(this);
    };
    /**
     * Appends to this instance.
     * @parasm value The data to append.
     */
    MultiRange.prototype.append = function (value) {
        if (value === undefined) {
            throw new TypeError('Invalid input');
        }
        else if (value instanceof MultiRange) {
            for (var _i = 0, _a = value.ranges; _i < _a.length; _i++) {
                var r = _a[_i];
                this.appendRange(r[0], r[1]);
            }
            return this;
        }
        else {
            return this.append(new MultiRange(value));
        }
    };
    /**
     * Appends a specified range of integers to this isntance.
     * @param min The minimum value of the range to append.
     * @param max The minimum value of the range to append.
     */
    MultiRange.prototype.appendRange = function (min, max) {
        var newRange = [min, max];
        if (newRange[0] > newRange[1]) {
            newRange = [newRange[1], newRange[0]];
        }
        if (newRange[0] === Infinity && newRange[1] === Infinity ||
            newRange[0] === -Infinity && newRange[1] === -Infinity) {
            throw new RangeError('Infinity can be used only within an unbounded range segment');
        }
        var overlap = this.findOverlap(newRange);
        this.ranges.splice(overlap.lo, overlap.count, overlap.union);
        return this;
    };
    /**
     * Subtracts from this instance.
     * @param value The data to subtract.
     */
    MultiRange.prototype.subtract = function (value) {
        if (value === undefined) {
            throw new TypeError('Invalid input');
        }
        else if (value instanceof MultiRange) {
            for (var _i = 0, _a = value.ranges; _i < _a.length; _i++) {
                var r = _a[_i];
                this.subtractRange(r[0], r[1]);
            }
            return this;
        }
        else {
            return this.subtract(new MultiRange(value));
        }
    };
    /**
     * Subtracts a specified range of integers from this instance.
     * @param min The minimum value of the range to subtract.
     * @param max The minimum value of the range to subtract.
     */
    MultiRange.prototype.subtractRange = function (min, max) {
        var newRange = [min, max];
        if (newRange[0] > newRange[1]) {
            newRange = [newRange[1], newRange[0]];
        }
        var overlap = this.findOverlap(newRange);
        if (overlap.count > 0) {
            var remain = [];
            if (this.ranges[overlap.lo][0] < newRange[0]) {
                remain.push([this.ranges[overlap.lo][0], newRange[0] - 1]);
            }
            if (newRange[1] < this.ranges[overlap.lo + overlap.count - 1][1]) {
                remain.push([newRange[1] + 1, this.ranges[overlap.lo + overlap.count - 1][1]]);
            }
            this.ranges.splice.apply(this.ranges, [overlap.lo, overlap.count].concat(remain));
        }
        return this;
    };
    /**
     * Remove integers which are not included in the given ranges (aka intersection).
     * @param value The data to calculate the intersetion.
     */
    MultiRange.prototype.intersect = function (value) {
        if (value === undefined) {
            throw new TypeError('Invalid input');
        }
        else if (value instanceof MultiRange) {
            var result = [];
            var jstart = 0; // used for optimization
            for (var i = 0; i < this.ranges.length; i++) {
                var r1 = this.ranges[i];
                for (var j = jstart; j < value.ranges.length; j++) {
                    var r2 = value.ranges[j];
                    if (r1[0] <= r2[1] && r1[1] >= r2[0]) {
                        jstart = j;
                        var min = Math.max(r1[0], r2[0]);
                        var max = Math.min(r1[1], r2[1]);
                        result.push([min, max]);
                    }
                    else if (r1[1] < r2[0]) {
                        break;
                    }
                }
            }
            this.ranges = result;
            return this;
        }
        else {
            return this.intersect(new MultiRange(value));
        }
    };
    /**
     * Determines how the given range overlaps or touches the existing ranges.
     * This is a helper method that calculates how an append/subtract operation
     * affects the existing range members.
     * @param target The range array to test.
     * @return An object containing information about how the given range
     * overlaps or touches this instance.
     */
    MultiRange.prototype.findOverlap = function (target) {
        //   a        b  c     d         e  f       g h i   j k  l       m
        //--------------------------------------------------------------------
        //   |----(0)----|     |---(1)---|  |---(2)---|          |--(3)--|
        //            |------------(A)--------------|
        //                                            |-(B)-|
        //                                              |-(C)-|
        //
        // (0)-(3) represent the existing ranges (this.ranges),
        // and (A)-(C) are the ranges being passed to this function.
        //
        // A pseudocode findOverlap(A) returns { lo: 0, count: 3, union: <a-h> },
        // meaning (A) overlaps the 3 existing ranges from index 0.
        //
        // findOverlap(B) returns { lo: 2, count: 1, union: <f-j> },
        // meaning (B) "touches" one range element, (2).
        //
        // findOverlap(C) returns { lo: 3, count: 0, union: <i-k> }
        // meaning (C) is between (2) and (3) but overlaps/touches neither of them.
        for (var hi = this.ranges.length - 1; hi >= 0; hi--) {
            var r = this.ranges[hi];
            var union = void 0;
            if (union = this.calcUnion(r, target)) {
                var count = 1;
                var tmp = void 0;
                while ((hi - count >= 0) && (tmp = this.calcUnion(union, this.ranges[hi - count]))) {
                    union = tmp;
                    count++;
                }
                // The given target touches or overlaps one or more of the existing ranges
                return { lo: hi + 1 - count, count: count, union: union };
            }
            else if (r[1] < target[0]) {
                // The given target does not touch nor overlap the existing ranges
                return { lo: hi + 1, count: 0, union: target };
            }
        }
        // The given target is smaller than the smallest existing range
        return { lo: 0, count: 0, union: target };
    };
    /**
     * Calculates the union of two specified ranges.
     * @param a Range A
     * @param b Range B
     * @return Union of a and b. Null if a and b do not touch nor intersect.
     */
    MultiRange.prototype.calcUnion = function (a, b) {
        if (a[1] + 1 < b[0] || a[0] - 1 > b[1]) {
            return null; // cannot make union
        }
        return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
    };
    /**
     * Exports the whole range data as an array of arrays.
     */
    MultiRange.prototype.getRanges = function () {
        var result = [];
        for (var _i = 0, _a = this.ranges; _i < _a.length; _i++) {
            var r = _a[_i];
            result.push([r[0], r[1]]);
        }
        return result;
    };
    /**
     * Checks if the instance contains the specified value.
     * @param value Value to be checked
     * @return True if the specified value is included in the instance.
     */
    MultiRange.prototype.has = function (value) {
        if (value === undefined) {
            throw new TypeError('Invalid input');
        }
        else if (value instanceof MultiRange) {
            var s = 0;
            var len = this.ranges.length;
            for (var _i = 0, _a = value.ranges; _i < _a.length; _i++) {
                var tr = _a[_i];
                var i = void 0;
                for (i = s; i < len; i++) {
                    var my = this.ranges[i];
                    if (tr[0] >= my[0] && tr[1] <= my[1] && tr[1] >= my[0] && tr[1] <= my[1])
                        break;
                }
                if (i === len)
                    return false;
            }
            return true;
        }
        else {
            return this.has(new MultiRange(value));
        }
    };
    /**
     * Checks if the instance contains the range specified by the two parameters.
     * @param min The minimum value of the range to subtract.
     * @param max The minimum value of the range to subtract.
     * @return True if the specified value is included in the instance.
     */
    MultiRange.prototype.hasRange = function (min, max) {
        return this.has(new MultiRange([[min, max]]));
    };
    /**
     * Returns the number of range segments.
     * For example, the segmentLength of `2-5,7,9-11' is 3.
     * Returns 0 for an empty instance.
     * @return The number of segments.
     */
    MultiRange.prototype.segmentLength = function () {
        return this.ranges.length;
    };
    /**
     * Calculates how many numbers are effectively included in this instance.
     * (i.e. '1-10,51-60,90' returns 21)
     * @return The number of integer values in this instance.
     *    Returns `Infinity` for unbounded ranges.
     */
    MultiRange.prototype.length = function () {
        if (this.isUnbounded())
            return Infinity;
        var result = 0;
        for (var _i = 0, _a = this.ranges; _i < _a.length; _i++) {
            var r = _a[_i];
            result += r[1] - r[0] + 1;
        }
        return result;
    };
    /**
     * Checks if two instances of MultiRange are identical.
     * @param cmp The data to compare.
     * @return True if cmp is exactly the same as this instance.
     */
    MultiRange.prototype.equals = function (cmp) {
        if (cmp === undefined) {
            throw new TypeError('Invalid input');
        }
        else if (cmp instanceof MultiRange) {
            if (cmp === this)
                return true;
            if (this.ranges.length !== cmp.ranges.length)
                return false;
            for (var i = 0; i < this.ranges.length; i++) {
                if (this.ranges[i][0] !== cmp.ranges[i][0] || this.ranges[i][1] !== cmp.ranges[i][1])
                    return false;
            }
            return true;
        }
        else {
            return this.equals(new MultiRange(cmp));
        }
    };
    /**
     * Checks if the current instance is unbounded (i.e., infinite).
     */
    MultiRange.prototype.isUnbounded = function () {
        return (this.ranges.length > 0
            && (this.ranges[0][0] === -Infinity ||
                this.ranges[this.ranges.length - 1][1] === Infinity));
    };
    /**
     * Returns the minimum number contained in this insntance. Can be -Infinity or undefined.
     */
    MultiRange.prototype.min = function () {
        if (this.ranges.length === 0)
            return undefined;
        return this.ranges[0][0];
    };
    /**
     * Returns the maximum number contained in this insntance. Can be +Infinity or undefined.
     */
    MultiRange.prototype.max = function () {
        if (this.ranges.length === 0)
            return undefined;
        return this.ranges[this.ranges.length - 1][1];
    };
    /**
     * Removes the smallest integer from this instance and returns that integer.
     */
    MultiRange.prototype.shift = function () {
        var min = this.min();
        if (min === -Infinity)
            throw new RangeError('shift() was invoked on an unbounded MultiRange which contains -Infinity');
        if (min !== undefined)
            this.subtract(min);
        return min;
    };
    /**
     * Removes the largest integer from this instance and returns that integer.
     */
    MultiRange.prototype.pop = function () {
        var max = this.max();
        if (max === Infinity)
            throw new RangeError('pop() was invoked on an unbounded MultiRange which contains +Infinity');
        if (max !== undefined)
            this.subtract(max);
        return max;
    };
    /**
     * Returns the string respresentation of this MultiRange.
     */
    MultiRange.prototype.toString = function () {
        function wrap(i) {
            return (i >= 0 ? String(i) : "(" + i + ")");
        }
        var ranges = [];
        for (var _i = 0, _a = this.ranges; _i < _a.length; _i++) {
            var r = _a[_i];
            if (r[0] === -Infinity) {
                if (r[1] === Infinity) {
                    ranges.push('-');
                }
                else {
                    ranges.push("-" + wrap(r[1]));
                }
            }
            else if (r[1] === Infinity) {
                ranges.push(wrap(r[0]) + "-");
            }
            else if (r[0] == r[1]) {
                ranges.push(wrap(r[0]));
            }
            else {
                ranges.push(wrap(r[0]) + "-" + wrap(r[1]));
            }
        }
        return ranges.join(',');
    };
    /**
     * Builds an array of integer which holds all elements in this MultiRange.
     * Note that this may be slow and memory-consuming for large ranges such as '1-10000'.
     */
    MultiRange.prototype.toArray = function () {
        if (this.isUnbounded()) {
            throw new RangeError('You cannot build an array from an unbounded range');
        }
        var result = new Array(this.length());
        var idx = 0;
        for (var _i = 0, _a = this.ranges; _i < _a.length; _i++) {
            var r = _a[_i];
            for (var n = r[0]; n <= r[1]; n++) {
                result[idx++] = n;
            }
        }
        return result;
    };
    /**
     * Returns ES6-compatible iterator.
     */
    MultiRange.prototype.getIterator = function () {
        var _this = this;
        if (this.isUnbounded()) {
            throw new RangeError('Unbounded ranges cannot be iterated over');
        }
        var i = 0, curRange = this.ranges[i], j = curRange ? curRange[0] : undefined;
        return {
            next: function () {
                if (!curRange)
                    return { done: true };
                var ret = j;
                if (++j > curRange[1]) {
                    curRange = _this.ranges[++i];
                    j = curRange ? curRange[0] : undefined;
                }
                return { value: ret };
            }
        };
    };
    return MultiRange;
}());
exports.MultiRange = MultiRange;
// Set ES6 iterator, if Symbol.iterator is defined
/* istanbul ignore else */
if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    MultiRange.prototype[Symbol.iterator] = MultiRange.prototype.getIterator;
}
// A shorthand function to get a new MultiRange instance
function multirange(data) {
    return new MultiRange(data);
}
exports.multirange = multirange;
