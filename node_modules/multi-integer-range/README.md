# multi-integer-range

[![Build Status](https://travis-ci.org/smikitky/node-multi-integer-range.svg?branch=dev)](https://travis-ci.org/smikitky/node-multi-integer-range)
[![Coverage Status](https://coveralls.io/repos/github/smikitky/node-multi-integer-range/badge.svg?branch=dev)](https://coveralls.io/github/smikitky/node-multi-integer-range)

A small library which parses and manipulates comma-delimited integer ranges (such as "1-3,8-10").
Such strings are typically used in print dialogs to indicate which pages to print.

Supported operations include:

- Addition (e.g., `1-2,6` + `3-5` => `1-6`)
- Subtraction (e.g., `1-10` - `5-9` => `1-4,10`)
- Inclusion check (e.g., `3,7-9` is in `1-10`)
- Intersection (e.g., `1-5` ∩ `2-8` => `2-5`)
- Unbounded ranges (e.g., `5-` to mean "all integers >= 5")
- ES6 iterator (`for ... of`, spread operator)
- Array creation (a.k.a. "flatten")

Internal data are always *sorted and normalized* to the smallest possible
representation.

## Usage

### Install

Install via npm: `npm install multi-integer-range`

This library has no external dependencies, and can be used with Webpack and Browserify.

### Basic Example


```js
var MultiRange = require('multi-integer-range').MultiRange;

var pages = new MultiRange('1-5,12-15');
pages.append(6).append([7,8]).append('9-11').subtract(2);
console.log(pages.toString()); // '1,3-15'
console.log(pages.has('5,9,12-14')); // true

console.log(pages.toArray()); // [1, 3, 4, 5, ... , 15]
console.log(pages.getRanges()); // [[1, 1], [3, 15]]
console.log(pages.segmentLength()); // 2
```

### Initializers

Some methods and the constructor take one *Initializer* parameter.
An initializer is one of:

- a valid string (eg `'1-3,5'`)
- an array of integers (eg `[1, 2, 3, 5]`)
- an array of `[number, number]` tuples (eg `[[1, 3], [5, 5]]`)
- mixture of the above (eg `[[1, 3], 5]`)
- a single integer (eg `1`)
- another MultiRange instance

Pass it to the constructor to create a MultiRange object,
or pass nothing to create an empty MultiRange object.

```ts
type Initializer =
    string | number | MultiRange | (number | [number, number])[];
```

A shorthand constructor function `multirange()` is also available.
Use whichever you prefer.

```js
var MultiRange = require('multi-integer-range').MultiRange;

var mr1 = new MultiRange([7, 2, 9, 1, 8, 3]);
var mr2 = new MultiRange('1-2, 3, 7-9');
var mr3 = new MultiRange([[1,3], [7,9]]);
var mr4 = new MultiRange(mr1); // clone

// function-style
var multirange = require('multi-integer-range').multirange;
var mr5 = multirange('1,2,3,7,8,9'); // the same as `new MultiRange`
```

Internal data are always sorted and normalized,
so the above five (`mr1`-`mr5`) hold a instance with identical range data.

The string parser is permissive and accepts space characters
before/after comma/hyphens. Order is not important either, and
overlapped numbers are silently ignored.

```js
var mr = new MultiRange('3,\t8-3,2,3,\n10, 9 - 7 ');
console.log(mr.toString()); // prints '2-10'
```

### Methods

Manipulation methods are mutable and chainable by design.
That is, for example, when you call `append(5)`, it will change
the internal representation and return the modified self,
rather than returning a new instance.
To get the copy of the instance, use `clone()`, or alternatively the copy constructor (`var copy = new MultiRange(orig)`).

- `new MultiRange(data?: Initializer)` Creates a new MultiRange object.
- `clone(): MultiRange` Clones this instance.
- `append(value: Initializer): MultiRange` Appends `value` to this instance.
- `subtract(value: Initializer): MultiRange` Subtracts `value` from this instance.
- `intersect(value: Initializer): MultiRange` Remove integers which are not included in `value` (aka intersection).
- `has(value: Initializer): boolean` Checks if the instance contains `value`.
- `length(): number` Calculates how many numbers are effectively included in this instance (ie, 5 for '3,5-7,9'). Returns Inifnity for an unbounded range.
- `segmentLength(): number` Returns the number of range segments (ie, 3 for '3,5-7,9' and 0 for an empty range)
- `equals(cmp: Initializer): boolean` Checks if two MultiRange data are identical.
- `isUnbounded(): boolean` Returns if the instance is unbounded.
- `min(): number | undefined` Returns the minimum integer. May return -Infinity.
- `max(): number | undefined` Returns the maxinum integer. May return Infinity.
- `shift(): number | undefined` Removes the minimum integer and returns it.
- `pop(): number | undefined` Removes the maxinum integer and returns it.
- `toString(): string` Returns the string respresentation of this MultiRange.
- `getRanges(): [number, number][]` Exports the whole range data as an array of [number, number] arrays.
- `toArray(): number[]` Builds an array of integer which holds all integers in this MultiRange. Note that this may be slow and memory-consuming for large ranges such as '1-10000'.
- `getIterator(): Object` Returns ES6-compatible iterator. See the description below.

The following methods were removed:

- `appendRange(min: number, max: number): MultiRange` Use `append([[min, max]])` instead.
- `subtractRange(min: number, max: number): MultiRange` Use `subtract([[min, max]])` instead.
- `hasRange(min: number, max: number): boolean` Use `has([[min, max]])` instead.
- `isContinuous(): boolean` Use `segmentLength() === 1` instead.


### Unbounded ranges

Starting from version 2.1, you can use unbounded (or infinite) ranges,
which look like this:

```js
// using the string parser...
var unbounded1 = new MultiRange('5-'); // all integers >= 5
var unbounded2 = new MultiRange('-3'); // all integers <= 3
var unbounded3 = new MultiRange('-'); // all integers

// or programmatically, using the JavaScript constant `Infinity`...
var unbounded4 = new MultiRange([[5, Infinity]]); // all integers >= 5
var unbounded5 = new MultiRange([[-Infinity, 3]]); // all integers <= 3
var unbounded6 = new MultiRange([[-Infinity, Infinity]]); // all integers
```

The manipulation methods work just as expected with unbounded ranges:

```js
console.log(multirange('5-10,15-').append('0,11-14') + ''); // '0,5-'
console.log(multirange('-').subtract('3-5,7,11-') + ''); // '-2,6,8-10'
console.log(multirange('-5,10-').has('-3,20')); // true

// intersection is especially useful to "trim" any unbounded ranges:
var userInput = '-10,15-20,90-';
var pagesInMyDoc = [[1, 100]]; // '1-100'
var pagesToPrint = multirange(userInput).intersect(pagesInMyDoc);
console.log(pagesToPrint.toString()); // prints '1-10,15-20,90-100'
```

Unbounded ranges cannot be iterated over, and you cannot call `#toArray()`
for the obvious reason. Calling `#length()` for unbounded ranges will return `Infinity`.

### Ranges Containing Zero and Negative Integers

You can handle ranges containing zero and negative integers.
To pass negative integers to the string parser, always contain them in parentheses.
Otherwise, it may be parsed as an unbounded range.
For example, passing `-5` to the string parser means
"all integers <=5 (including 0 and all negative integers)" rather than "minus five".

```js
var mr1 = new MultiRange('(-5),(-1)-0'); // -5, -1 and 0
mr1.append([[-4, -2]]); // -4 to -2
console.log(mr1 + ''); // prints '(-5)-0'
```

If you are only interested in positive numbers, you can use
`.intersect('1-')` to drop all negative integers and zero.

### Iteration

**ES2015 (ES6) iterator**: If `Symbol.iterator` is defined in the runtime,
you can simply iterate over the instance like this:

```js
for (let page of multirange('2,5-7')) {
    console.log(page);
} // prints 2, 5, 6, 7

// Instead of calling toArray() ...
var arr = [...multirange('2,5-7')]; // array spreading
// arr becomes [2, 5, 6, 7]
```

If `Symbol.iterator` is not available, you can still access the iterator
implementation and use it manually like this:

```js
var it = multirange('2,5-7').getIterator(),
    page;
while (!(page = it.next()).done) {
    console.log(page.value);
}
```

## TypeScript Definition File

This library comes with a TypeScript definition file. Starting from TypeScript 1.6,
The TypeScript compiler can find this definition file automatically.

The definition file only contains declarations that are compatible with ES5.
If your TypeScript project targets ES6 (`--target ES6`) and uses iterators,
add the following snippet somewhere in your project (e.g., "typings" directory)
to avoid compile-time errors.

```ts
declare module "multi-integer-range" {
    interface MultiRange {
        [Symbol.iterator](): Iterator<number>;
    }
}
```

## Changelog

See [the relase page on GitHub](https://github.com/smikitky/node-multi-integer-range/releases).

## Development

### Building and Testing

```
npm install
npm run build
npm test
```

### Bugs

Report any bugs and suggestions using GitHub issues.

**Performance Considerations**: This library works efficiently for large ranges
as long as they're *mostly* continuous (e.g., `1-10240000,20480000-50960000`).
However, this library is not intended to be efficient
with a heavily fragmentated set of integers which are scarcely continuous
(e.g., random 10000 integers between 1 to 1000000).

## Author

Soichiro Miki (https://github.com/smikitky)

## License

MIT
