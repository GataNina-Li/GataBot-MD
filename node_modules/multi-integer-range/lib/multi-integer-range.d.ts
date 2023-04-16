/*! multi-integer-range (c) 2015 Soichiro Miki */
export declare type Range = [number, number];
export declare type Initializer = string | number | (number | Range)[] | MultiRange;
export declare class MultiRange {
    private ranges;
    /**
     * Creates a new MultiRange object.
     */
    constructor(data?: Initializer);
    /**
     * Parses the initialize string and build the range data.
     * Override this if you need to customize the parsing strategy.
     */
    protected parseString(data: string): void;
    /**
     * Clones this instance.
     */
    clone(): MultiRange;
    /**
     * Appends to this instance.
     * @parasm value The data to append.
     */
    append(value: Initializer): MultiRange;
    /**
     * Appends a specified range of integers to this isntance.
     * @param min The minimum value of the range to append.
     * @param max The minimum value of the range to append.
     */
    private appendRange(min, max);
    /**
     * Subtracts from this instance.
     * @param value The data to subtract.
     */
    subtract(value: Initializer): MultiRange;
    /**
     * Subtracts a specified range of integers from this instance.
     * @param min The minimum value of the range to subtract.
     * @param max The minimum value of the range to subtract.
     */
    private subtractRange(min, max);
    /**
     * Remove integers which are not included in the given ranges (aka intersection).
     * @param value The data to calculate the intersetion.
     */
    intersect(value: Initializer): MultiRange;
    /**
     * Determines how the given range overlaps or touches the existing ranges.
     * This is a helper method that calculates how an append/subtract operation
     * affects the existing range members.
     * @param target The range array to test.
     * @return An object containing information about how the given range
     * overlaps or touches this instance.
     */
    private findOverlap(target);
    /**
     * Calculates the union of two specified ranges.
     * @param a Range A
     * @param b Range B
     * @return Union of a and b. Null if a and b do not touch nor intersect.
     */
    private calcUnion(a, b);
    /**
     * Exports the whole range data as an array of arrays.
     */
    getRanges(): Range[];
    /**
     * Checks if the instance contains the specified value.
     * @param value Value to be checked
     * @return True if the specified value is included in the instance.
     */
    has(value: Initializer): boolean;
    /**
     * Checks if the instance contains the range specified by the two parameters.
     * @param min The minimum value of the range to subtract.
     * @param max The minimum value of the range to subtract.
     * @return True if the specified value is included in the instance.
     */
    private hasRange(min, max);
    /**
     * Returns the number of range segments.
     * For example, the segmentLength of `2-5,7,9-11' is 3.
     * Returns 0 for an empty instance.
     * @return The number of segments.
     */
    segmentLength(): number;
    /**
     * Calculates how many numbers are effectively included in this instance.
     * (i.e. '1-10,51-60,90' returns 21)
     * @return The number of integer values in this instance.
     *    Returns `Infinity` for unbounded ranges.
     */
    length(): number;
    /**
     * Checks if two instances of MultiRange are identical.
     * @param cmp The data to compare.
     * @return True if cmp is exactly the same as this instance.
     */
    equals(cmp: Initializer): boolean;
    /**
     * Checks if the current instance is unbounded (i.e., infinite).
     */
    isUnbounded(): boolean;
    /**
     * Returns the minimum number contained in this insntance. Can be -Infinity or undefined.
     */
    min(): number | undefined;
    /**
     * Returns the maximum number contained in this insntance. Can be +Infinity or undefined.
     */
    max(): number | undefined;
    /**
     * Removes the smallest integer from this instance and returns that integer.
     */
    shift(): number | undefined;
    /**
     * Removes the largest integer from this instance and returns that integer.
     */
    pop(): number | undefined;
    /**
     * Returns the string respresentation of this MultiRange.
     */
    toString(): string;
    /**
     * Builds an array of integer which holds all elements in this MultiRange.
     * Note that this may be slow and memory-consuming for large ranges such as '1-10000'.
     */
    toArray(): number[];
    /**
     * Returns ES6-compatible iterator.
     */
    getIterator(): {
        next: () => {
            done?: boolean;
            value?: number;
        };
    };
}
export declare function multirange(data?: Initializer): MultiRange;
