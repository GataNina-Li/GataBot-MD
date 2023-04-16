/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * =============================================================================
 */
import * as tf from '@tensorflow/tfjs-core';
import * as seedrandom from 'seedrandom';
import { deepClone } from '../util/deep_clone';
import { deepMapAndAwaitAll, deepZip, zipToList } from '../util/deep_map';
import { GrowingRingBuffer } from '../util/growing_ring_buffer';
import { RingBuffer } from '../util/ring_buffer';
// Here we implement a simple asynchronous iterator.
// This lets us avoid using either third-party stream libraries or
// recent TypeScript language support requiring polyfills.
/**
 * Create a `LazyIterator` from an array of items.
 */
export function iteratorFromItems(items) {
    return new ArrayIterator(items);
}
/**
 * Create a `LazyIterator` of incrementing integers.
 */
export function iteratorFromIncrementing(start) {
    let i = start;
    return iteratorFromFunction(() => ({ value: i++, done: false }));
}
/**
 * Create a `LazyIterator` from a function.
 *
 * ```js
 * let i = -1;
 * const func = () =>
 *    ++i < 5 ? {value: i, done: false} : {value: null, done: true};
 * const iter = tf.data.iteratorFromFunction(func);
 * await iter.forEachAsync(e => console.log(e));
 * ```
 *
 * @param func A function that produces data on each call.
 */
export function iteratorFromFunction(func) {
    return new FunctionCallIterator(func);
}
/**
 * Create a `LazyIterator` by concatenating underlying streams, which are
 * themselves provided as a stream.
 *
 * This can also be thought of as a "stream flatten" operation.
 *
 * @param baseIterators A stream of streams to be concatenated.
 * @param baseErrorHandler An optional function that can intercept `Error`s
 *   raised during a `next()` call on the base stream.  This function can decide
 *   whether the error should be propagated, whether the error should be
 *   ignored, or whether the base stream should be terminated.
 */
export function iteratorFromConcatenated(baseIterators, baseErrorHandler) {
    return new ChainedIterator(baseIterators, baseErrorHandler);
}
/**
 * Create a `LazyIterator` by concatenating streams produced by calling a
 * stream-generating function a given number of times.
 *
 * Since a `LazyIterator` is read-once, it cannot be repeated, but this
 * function can be used to achieve a similar effect:
 *
 *   LazyIterator.ofConcatenatedFunction(() => new MyIterator(), 6);
 *
 * @param iteratorFunc: A function that produces a new stream on each call.
 * @param count: The number of times to call the function.
 * @param baseErrorHandler An optional function that can intercept `Error`s
 *   raised during a `next()` call on the base stream.  This function can decide
 *   whether the error should be propagated, whether the error should be
 *   ignored, or whether the base stream should be terminated.
 */
export function iteratorFromConcatenatedFunction(iteratorFunc, count, baseErrorHandler) {
    return iteratorFromConcatenated(iteratorFromFunction(iteratorFunc).take(count), baseErrorHandler);
}
/**
 * Create a `LazyIterator` by zipping together an array, dict, or nested
 * structure of `LazyIterator`s (and perhaps additional constants).
 *
 * The underlying streams must provide elements in a consistent order such
 * that they correspond.
 *
 * Typically, the underlying streams should have the same number of
 * elements. If they do not, the behavior is determined by the
 * `mismatchMode` argument.
 *
 * The nested structure of the `iterators` argument determines the
 * structure of elements in the resulting iterator.
 *
 * @param iterators: An array or object containing LazyIterators at the
 * leaves.
 * @param mismatchMode: Determines what to do when one underlying iterator
 * is exhausted before the others.  `ZipMismatchMode.FAIL` (the default)
 * causes an error to be thrown in this case.  `ZipMismatchMode.SHORTEST`
 * causes the zipped iterator to terminate with the furst underlying
 * streams, so elements remaining on the longer streams are ignored.
 * `ZipMismatchMode.LONGEST` causes the zipped stream to continue, filling
 * in nulls for the exhausted streams, until all streams are exhausted.
 */
export function iteratorFromZipped(iterators, mismatchMode = ZipMismatchMode.FAIL) {
    return new ZipIterator(iterators, mismatchMode);
}
/**
 * An asynchronous iterator, providing lazy access to a potentially
 * unbounded stream of elements.
 *
 * Iterator can be obtained from a dataset:
 * `const iter = await dataset.iterator();`
 */
export class LazyIterator {
    /**
     * Collect all remaining elements of a bounded stream into an array.
     * Obviously this will succeed only for small streams that fit in memory.
     * Useful for testing.
     *
     * @returns A Promise for an array of stream elements, which will resolve
     *   when the stream is exhausted.
     */
    async toArray() {
        const result = [];
        let x = await this.next();
        while (!x.done) {
            result.push(x.value);
            x = await this.next();
        }
        return result;
    }
    /**
     * Collect all elements of this dataset into an array with prefetching 100
     * elements. This is useful for testing, because the prefetch changes the
     * order in which the Promises are resolved along the processing pipeline.
     * This may help expose bugs where results are dependent on the order of
     * Promise resolution rather than on the logical order of the stream (i.e.,
     * due to hidden mutable state).
     *
     * @returns A Promise for an array of stream elements, which will resolve
     *   when the stream is exhausted.
     */
    async toArrayForTest() {
        const stream = this.prefetch(100);
        const result = [];
        let x = await stream.next();
        while (!x.done) {
            result.push(x.value);
            x = await stream.next();
        }
        return result;
    }
    /**
     * Draw items from the stream until it is exhausted.
     *
     * This can be useful when the stream has side effects but no output.  In
     * that case, calling this function guarantees that the stream will be
     * fully processed.
     */
    async resolveFully() {
        let x = await this.next();
        while (!x.done) {
            x = await this.next();
        }
    }
    /**
     * Draw items from the stream until it is exhausted, or a predicate fails.
     *
     * This can be useful when the stream has side effects but no output.  In
     * that case, calling this function guarantees that the stream will be
     * fully processed.
     */
    async resolveWhile(predicate) {
        let x = await this.next();
        let shouldContinue = predicate(x.value);
        while ((!x.done) && shouldContinue) {
            x = await this.next();
            shouldContinue = predicate(x.value);
        }
    }
    /**
     * Handles errors thrown on this stream using a provided handler function.
     *
     * @param handler A function that handles any `Error` thrown during a `next()`
     *   call and returns true if the stream should continue (dropping the failed
     *   call) or false if the stream should quietly terminate.  If the handler
     *   itself throws (or rethrows) an `Error`, that will be propagated.
     *
     * @returns A `LazyIterator` of elements passed through from upstream,
     *   possibly filtering or terminating on upstream `next()` calls that
     *   throw an `Error`.
     */
    handleErrors(handler) {
        return new ErrorHandlingLazyIterator(this, handler);
    }
    // TODO(soergel): Implement reduce() etc.
    /**
     * Filters this stream according to `predicate`.
     *
     * @param predicate A function mapping a stream element to a boolean or a
     * `Promise` for one.
     *
     * @returns A `LazyIterator` of elements for which the predicate was true.
     */
    filter(predicate) {
        return new FilterIterator(this, predicate);
    }
    /**
     * Maps this stream through a 1-to-1 transform.
     *
     * @param transform A function mapping a stream element to a transformed
     *   element.
     *
     * @returns A `LazyIterator` of transformed elements.
     */
    map(transform) {
        return new MapIterator(this, transform);
    }
    /**
     * Maps this stream through an async 1-to-1 transform.
     *
     * @param transform A function mapping a stream element to a `Promise` for a
     *   transformed stream element.
     *
     * @returns A `LazyIterator` of transformed elements.
     */
    mapAsync(transform) {
        return new AsyncMapIterator(this, transform);
    }
    /**
     * Maps this stream through a 1-to-1 transform, forcing serial execution.
     *
     * @param transform A function mapping a stream element to a transformed
     *   element.
     *
     * @returns A `LazyIterator` of transformed elements.
     */
    serialMapAsync(transform) {
        return new AsyncMapIterator(this, transform).serial();
    }
    /**
     * Maps this stream through a 1-to-many transform.
     *
     * @param transform A function mapping a stream element to an array of
     *   transformed elements.
     *
     * @returns A `DataStream` of transformed elements.
     */
    flatmap(transform) {
        return new FlatmapIterator(this, transform);
    }
    /**
     * Apply a function to every element of the stream.
     *
     * @param f A function to apply to each stream element.
     */
    async forEachAsync(f) {
        return this.map(f).resolveFully();
    }
    /**
     * Apply a function to every element of the stream, forcing serial execution.
     *
     * @param f A function to apply to each stream element.  Should return 'true'
     *   to indicate that the stream should continue, or 'false' to cause it to
     *   terminate.
     */
    async serialForEach(f) {
        return this.serialMapAsync(f).resolveWhile(x => (x === true));
    }
    /**
     * Groups elements into batches, represented as arrays of elements.
     *
     * We can think of the elements of this iterator as 'rows' (even if they are
     * nested structures).  By the same token, consecutive values for a given
     * key within the elements form a 'column'.  This matches the usual sense of
     * 'row' and 'column' when processing tabular data (e.g., parsing a CSV).
     *
     * Thus, "Row-major" means that the resulting batch is simply a collection of
     * rows: `[row1, row2, row3, ...]`.  This is contrast to the column-major
     * form, which is needed for vectorized computation.
     *
     * @param batchSize The number of elements desired per batch.
     * @param smallLastBatch Whether to emit the final batch when it has fewer
     *   than batchSize elements. Default true.
     * @returns A `LazyIterator` of batches of elements, represented as arrays
     *   of the original element type.
     */
    rowMajorBatch(batchSize, smallLastBatch = true) {
        return new RowMajorBatchIterator(this, batchSize, smallLastBatch);
    }
    /**
     * Groups elements into batches, represented in column-major form.
     *
     * We can think of the elements of this iterator as 'rows' (even if they are
     * nested structures).  By the same token, consecutive values for a given
     * key within the elements form a 'column'.  This matches the usual sense of
     * 'row' and 'column' when processing tabular data (e.g., parsing a CSV).
     *
     * Thus, "column-major" means that the resulting batch is a (potentially
     * nested) structure representing the columns.  Each column entry, then,
     * contains a collection of the values found in that column for a range of
     * input elements.  This representation allows for vectorized computation, in
     * contrast to the row-major form.
     *
     * The inputs should all have the same nested structure (i.e., of arrays and
     * dicts).  The result is a single object with the same nested structure,
     * where the leaves are arrays collecting the values of the inputs at that
     * location (or, optionally, the result of a custom function applied to those
     * arrays).
     *
     * @param batchSize The number of elements desired per batch.
     * @param smallLastBatch Whether to emit the final batch when it has fewer
     *   than batchSize elements. Default true.
     * @param zipFn: (optional) A function that expects an array of elements at a
     *   single node of the object tree, and returns a `DeepMapResult`.  The
     *   `DeepMapResult` either provides a result value for that node (i.e.,
     *   representing the subtree), or indicates that the node should be processed
     *   recursively.  The default zipFn recurses as far as possible and places
     *   arrays at the leaves.
     * @returns A `LazyIterator` of batches of elements, represented as an object
     *   with collections at the leaves.
     */
    columnMajorBatch(batchSize, smallLastBatch = true, 
    // tslint:disable-next-line:no-any
    zipFn = zipToList) {
        // First collect the desired number of input elements as a row-major batch.
        const rowBatches = this.rowMajorBatch(batchSize, smallLastBatch);
        // Now 'rotate' or 'pivot' the data, collecting all values from each column
        // in the batch (i.e., for each key within the elements) into an array.
        return rowBatches.map(x => deepZip(x, zipFn));
    }
    /**
     * Concatenate this `LazyIterator` with another.
     *
     * @param iterator A `LazyIterator` to be concatenated onto this one.
     * @param baseErrorHandler An optional function that can intercept `Error`s
     *   raised during a `next()` call on the base stream.  This function can
     *   decide whether the error should be propagated, whether the error should
     *   be ignored, or whether the base stream should be terminated.
     * @returns A `LazyIterator`.
     */
    concatenate(iterator, baseErrorHandler) {
        return new ChainedIterator(iteratorFromItems([this, iterator]), baseErrorHandler);
    }
    /**
     * Limits this stream to return at most `count` items.
     *
     * @param count The maximum number of items to provide from the stream. If
     * a negative or undefined value is given, the entire stream is returned
     *   unaltered.
     */
    take(count) {
        if (count < 0 || count == null) {
            return this;
        }
        return new TakeIterator(this, count);
    }
    /**
     * Skips the first `count` items in this stream.
     *
     * @param count The number of items to skip.  If a negative or undefined
     * value is given, the entire stream is returned unaltered.
     */
    skip(count) {
        if (count < 0 || count == null) {
            return this;
        }
        return new SkipIterator(this, count);
    }
    /**
     * Prefetch the first `bufferSize` items in this stream.
     *
     * Note this prefetches Promises, but makes no guarantees about when those
     * Promises resolve.
     *
     * @param bufferSize: An integer specifying the number of elements to be
     *   prefetched.
     */
    prefetch(bufferSize) {
        return new PrefetchIterator(this, bufferSize);
    }
    // TODO(soergel): deep sharded shuffle, where supported
    /**
     * Randomly shuffles the elements of this stream.
     *
     * @param bufferSize: An integer specifying the number of elements from
     * this stream from which the new stream will sample.
     * @param seed: (Optional.) An integer specifying the random seed that
     * will be used to create the distribution.
     */
    shuffle(windowSize, seed) {
        return new ShuffleIterator(this, windowSize, seed);
    }
    /**
     * Force an iterator to execute serially: each next() call will await the
     * prior one, so that they cannot execute concurrently.
     */
    serial() {
        return new SerialIterator(this);
    }
}
// ============================================================================
// The following private classes serve to implement the chainable methods
// on LazyIterator.  Unfortunately they can't be placed in separate files,
// due to resulting trouble with circular imports.
// ============================================================================
// Iterators that just extend LazyIterator directly
// ============================================================================
class ArrayIterator extends LazyIterator {
    constructor(items) {
        super();
        this.items = items;
        this.trav = 0;
    }
    summary() {
        return `Array of ${this.items.length} items`;
    }
    async next() {
        if (this.trav >= this.items.length) {
            return { value: null, done: true };
        }
        const item = this.items[this.trav];
        this.trav++;
        return { value: deepClone(item), done: false };
    }
}
class FunctionCallIterator extends LazyIterator {
    constructor(nextFn) {
        super();
        this.nextFn = nextFn;
    }
    summary() {
        return `Function call`;
    }
    async next() {
        try {
            return this.nextFn();
        }
        catch (e) {
            // Modify the error message but leave the stack trace intact
            e.message =
                `Error thrown while iterating through a dataset: ${e.message}`;
            throw e;
        }
    }
}
class SerialIterator extends LazyIterator {
    constructor(upstream) {
        super();
        this.upstream = upstream;
        this.lastRead = Promise.resolve({ value: null, done: false });
    }
    summary() {
        return `${this.upstream.summary()} -> Serial`;
    }
    async next() {
        // This sets this.lastRead to a new Promise right away, as opposed to
        // saying `await this.lastRead; this.lastRead = this.serialNext();` which
        // would not work because this.nextRead would be updated only after the
        // promise resolves.
        this.lastRead = this.lastRead.then(() => this.serialNext());
        return this.lastRead;
    }
    async serialNext() {
        return this.upstream.next();
    }
}
class SkipIterator extends LazyIterator {
    constructor(upstream, maxCount) {
        super();
        this.upstream = upstream;
        this.maxCount = maxCount;
        // Local state that should not be clobbered by out-of-order execution.
        this.count = 0;
        this.lastRead = Promise.resolve({ value: null, done: false });
    }
    summary() {
        return `${this.upstream.summary()} -> Skip`;
    }
    async next() {
        // This sets this.lastRead to a new Promise right away, as opposed to
        // saying `await this.lastRead; this.lastRead = this.serialNext();` which
        // would not work because this.nextRead would be updated only after the
        // promise resolves.
        this.lastRead = this.lastRead.then(() => this.serialNext());
        return this.lastRead;
    }
    async serialNext() {
        // TODO(soergel): consider tradeoffs of reading in parallel, eg.
        // collecting next() promises in an Array and then waiting for
        // Promise.all() of those. Benefit: pseudo-parallel execution.  Drawback:
        // maybe delayed GC.
        while (this.count++ < this.maxCount) {
            const skipped = await this.upstream.next();
            // short-circuit if upstream is already empty
            if (skipped.done) {
                return skipped;
            }
            tf.dispose(skipped.value);
        }
        return this.upstream.next();
    }
}
class TakeIterator extends LazyIterator {
    constructor(upstream, maxCount) {
        super();
        this.upstream = upstream;
        this.maxCount = maxCount;
        this.count = 0;
    }
    summary() {
        return `${this.upstream.summary()} -> Take`;
    }
    async next() {
        if (this.count++ >= this.maxCount) {
            return { value: null, done: true };
        }
        return this.upstream.next();
    }
}
// Note this batch just groups items into row-wise element arrays.
// Rotating these to a column-wise representation happens only at the dataset
// level.
class RowMajorBatchIterator extends LazyIterator {
    constructor(upstream, batchSize, enableSmallLastBatch = true) {
        super();
        this.upstream = upstream;
        this.batchSize = batchSize;
        this.enableSmallLastBatch = enableSmallLastBatch;
        this.lastRead = Promise.resolve({ value: null, done: false });
    }
    summary() {
        return `${this.upstream.summary()} -> RowMajorBatch`;
    }
    async next() {
        // This sets this.lastRead to a new Promise right away, as opposed to
        // saying `await this.lastRead; this.lastRead = this.serialNext();` which
        // would not work because this.nextRead would be updated only after the
        // promise resolves.
        this.lastRead = this.lastRead.then(() => this.serialNext());
        return this.lastRead;
    }
    async serialNext() {
        const batch = [];
        while (batch.length < this.batchSize) {
            const item = await this.upstream.next();
            if (item.done) {
                if (this.enableSmallLastBatch && batch.length > 0) {
                    return { value: batch, done: false };
                }
                return { value: null, done: true };
            }
            batch.push(item.value);
        }
        return { value: batch, done: false };
    }
}
class FilterIterator extends LazyIterator {
    constructor(upstream, predicate) {
        super();
        this.upstream = upstream;
        this.predicate = predicate;
        this.lastRead = Promise.resolve({ value: null, done: false });
    }
    summary() {
        return `${this.upstream.summary()} -> Filter`;
    }
    async next() {
        // This sets this.lastRead to a new Promise right away, as opposed to
        // saying `await this.lastRead; this.lastRead = this.serialNext();` which
        // would not work because this.nextRead would be updated only after the
        // promise resolves.
        this.lastRead = this.lastRead.then(() => this.serialNext());
        return this.lastRead;
    }
    async serialNext() {
        while (true) {
            const item = await this.upstream.next();
            if (item.done || this.predicate(item.value)) {
                return item;
            }
            tf.dispose(item.value);
        }
    }
}
class MapIterator extends LazyIterator {
    constructor(upstream, transform) {
        super();
        this.upstream = upstream;
        this.transform = transform;
    }
    summary() {
        return `${this.upstream.summary()} -> Map`;
    }
    async next() {
        const item = await this.upstream.next();
        if (item.done) {
            return { value: null, done: true };
        }
        const inputTensors = tf.tensor_util.getTensorsInContainer(item.value);
        // Careful: the transform may mutate the item in place.
        // That's why we have to remember the input Tensors above, and then
        // below dispose only those that were not passed through to the output.
        // Note too that the transform function is responsible for tidying
        // any intermediate Tensors.  Here we are concerned only about the
        // inputs.
        const mapped = this.transform(item.value);
        const outputTensors = tf.tensor_util.getTensorsInContainer(mapped);
        // TODO(soergel) faster intersection
        // TODO(soergel) move to tf.disposeExcept(in, out)?
        for (const t of inputTensors) {
            if (!tf.tensor_util.isTensorInList(t, outputTensors)) {
                t.dispose();
            }
        }
        return { value: mapped, done: false };
    }
}
class ErrorHandlingLazyIterator extends LazyIterator {
    constructor(upstream, handler) {
        super();
        this.upstream = upstream;
        this.handler = handler;
        this.count = 0;
        this.lastRead = Promise.resolve({ value: null, done: false });
    }
    summary() {
        return `${this.upstream.summary()} -> handleErrors`;
    }
    async next() {
        // This sets this.lastRead to a new Promise right away, as opposed to
        // saying `await this.lastRead; this.lastRead = this.serialNext();` which
        // would not work because this.nextRead would be updated only after the
        // promise resolves.
        this.lastRead = this.lastRead.then(() => this.serialNext());
        return this.lastRead;
    }
    async serialNext() {
        while (true) {
            try {
                return await this.upstream.next();
            }
            catch (e) {
                if (!this.handler(e)) {
                    return { value: null, done: true };
                }
                // If the handler returns true, loop and fetch the next upstream item.
                // If the upstream iterator throws an endless stream of errors, and if
                // the handler says to ignore them, then we loop forever here.  That is
                // the correct behavior-- it's up to the handler to decide when to stop.
            }
        }
    }
}
class AsyncMapIterator extends LazyIterator {
    constructor(upstream, transform) {
        super();
        this.upstream = upstream;
        this.transform = transform;
    }
    summary() {
        return `${this.upstream.summary()} -> AsyncMap`;
    }
    async next() {
        const item = await this.upstream.next();
        if (item.done) {
            return { value: null, done: true };
        }
        const inputTensors = tf.tensor_util.getTensorsInContainer(item.value);
        // Careful: the transform may mutate the item in place.
        // That's why we have to remember the input Tensors above, and then
        // below dispose only those that were not passed through to the output.
        // Note too that the transform function is responsible for tidying
        // any intermediate Tensors.  Here we are concerned only about the
        // inputs.
        const mapped = await this.transform(item.value);
        const outputTensors = tf.tensor_util.getTensorsInContainer(mapped);
        // TODO(soergel) faster intersection
        // TODO(soergel) move to tf.disposeExcept(in, out)?
        for (const t of inputTensors) {
            if (!tf.tensor_util.isTensorInList(t, outputTensors)) {
                t.dispose();
            }
        }
        return { value: mapped, done: false };
    }
}
// Iterators that maintain a queue of pending items
// ============================================================================
/**
 * A base class for transforming streams that operate by maintaining an
 * output queue of elements that are ready to return via next().  This is
 * commonly required when the transformation is 1-to-many:  A call to next()
 * may trigger a call to the underlying stream, which will produce many
 * mapped elements of this stream-- of which we need to return only one, so
 * we have to queue the rest.
 */
export class OneToManyIterator extends LazyIterator {
    constructor() {
        super();
        this.outputQueue = new GrowingRingBuffer();
        this.lastRead = Promise.resolve({ value: null, done: false });
    }
    async next() {
        // This sets this.lastRead to a new Promise right away, as opposed to
        // saying `await this.lastRead; this.lastRead = this.serialNext();` which
        // would not work because this.nextRead would be updated only after the
        // promise resolves.
        this.lastRead = this.lastRead.then(() => this.serialNext());
        return this.lastRead;
    }
    async serialNext() {
        // Fetch so that the queue contains at least one item if possible.
        // If the upstream source is exhausted, AND there are no items left in
        // the output queue, then this stream is also exhausted.
        while (this.outputQueue.length() === 0) {
            // TODO(soergel): consider parallel reads.
            if (!await this.pump()) {
                return { value: null, done: true };
            }
        }
        return { value: this.outputQueue.shift(), done: false };
    }
}
class FlatmapIterator extends OneToManyIterator {
    constructor(upstream, transform) {
        super();
        this.upstream = upstream;
        this.transform = transform;
    }
    summary() {
        return `${this.upstream.summary()} -> Flatmap`;
    }
    async pump() {
        const item = await this.upstream.next();
        if (item.done) {
            return false;
        }
        const inputTensors = tf.tensor_util.getTensorsInContainer(item.value);
        // Careful: the transform may mutate the item in place.
        // that's why we have to remember the input Tensors above, and then
        // below dispose only those that were not passed through to the output.
        // Note too that the transform function is responsible for tidying any
        // intermediate Tensors.  Here we are concerned only about the inputs.
        const mappedArray = this.transform(item.value);
        const outputTensors = tf.tensor_util.getTensorsInContainer(mappedArray);
        this.outputQueue.pushAll(mappedArray);
        // TODO(soergel) faster intersection, and deduplicate outputTensors
        // TODO(soergel) move to tf.disposeExcept(in, out)?
        for (const t of inputTensors) {
            if (!tf.tensor_util.isTensorInList(t, outputTensors)) {
                t.dispose();
            }
        }
        return true;
    }
}
/**
 * Provides a `LazyIterator` that concatenates a stream of underlying
 * streams.
 *
 * Doing this in a concurrency-safe way requires some trickery.  In
 * particular, we want this stream to return the elements from the
 * underlying streams in the correct order according to when next() was
 * called, even if the resulting Promises resolve in a different order.
 */
export class ChainedIterator extends LazyIterator {
    constructor(iterators, baseErrorHandler) {
        super();
        this.baseErrorHandler = baseErrorHandler;
        // Strict Promise execution order:
        // a next() call may not even begin until the previous one completes.
        this.lastRead = null;
        // Local state that should not be clobbered by out-of-order execution.
        this.iterator = null;
        this.moreIterators = iterators;
    }
    summary() {
        const upstreamSummaries = 'TODO: fill in upstream of chained summaries';
        return `${upstreamSummaries} -> Chained`;
    }
    async next() {
        this.lastRead = this.readFromChain(this.lastRead);
        return this.lastRead;
    }
    async readFromChain(lastRead) {
        // Must await on the previous read since the previous read may have advanced
        // the stream of streams, from which we need to read.
        // This is unfortunate since we can't parallelize reads. Which means
        // prefetching of chained streams is a no-op.
        // One solution is to prefetch immediately upstream of this.
        await lastRead;
        if (this.iterator == null) {
            const iteratorResult = await this.moreIterators.next();
            if (iteratorResult.done) {
                // No more streams to stream from.
                return { value: null, done: true };
            }
            this.iterator = iteratorResult.value;
            if (this.baseErrorHandler != null) {
                this.iterator = this.iterator.handleErrors(this.baseErrorHandler);
            }
        }
        const itemResult = await this.iterator.next();
        if (itemResult.done) {
            this.iterator = null;
            return this.readFromChain(lastRead);
        }
        return itemResult;
    }
}
export var ZipMismatchMode;
(function (ZipMismatchMode) {
    ZipMismatchMode[ZipMismatchMode["FAIL"] = 0] = "FAIL";
    ZipMismatchMode[ZipMismatchMode["SHORTEST"] = 1] = "SHORTEST";
    ZipMismatchMode[ZipMismatchMode["LONGEST"] = 2] = "LONGEST"; // use nulls for exhausted streams; use up the longest stream.
})(ZipMismatchMode || (ZipMismatchMode = {}));
/**
 * Provides a `LazyIterator` that zips together an array, dict, or nested
 * structure of `LazyIterator`s (and perhaps additional constants).
 *
 * The underlying streams must provide elements in a consistent order such
 * that they correspond.
 *
 * Typically, the underlying streams should have the same number of
 * elements. If they do not, the behavior is determined by the
 * `mismatchMode` argument.
 *
 * The nested structure of the `iterators` argument determines the
 * structure of elements in the resulting iterator.
 *
 * Doing this in a concurrency-safe way requires some trickery.  In
 * particular, we want this stream to return the elements from the
 * underlying streams in the correct order according to when next() was
 * called, even if the resulting Promises resolve in a different order.
 *
 * @param iterators: An array or object containing LazyIterators at the
 * leaves.
 * @param mismatchMode: Determines what to do when one underlying iterator
 * is exhausted before the others.  `ZipMismatchMode.FAIL` (the default)
 * causes an error to be thrown in this case.  `ZipMismatchMode.SHORTEST`
 * causes the zipped iterator to terminate with the furst underlying
 * streams, so elements remaining on the longer streams are ignored.
 * `ZipMismatchMode.LONGEST` causes the zipped stream to continue, filling
 * in nulls for the exhausted streams, until all streams are exhausted.
 */
class ZipIterator extends LazyIterator {
    constructor(iterators, mismatchMode = ZipMismatchMode.FAIL) {
        super();
        this.iterators = iterators;
        this.mismatchMode = mismatchMode;
        this.count = 0;
        this.currentPromise = null;
    }
    summary() {
        const upstreamSummaries = 'TODO: fill in upstream of zip summaries';
        return `{${upstreamSummaries}} -> Zip`;
    }
    async nextState(afterState) {
        // This chaining ensures that the underlying next() are not even called
        // before the previous ones have resolved.
        await afterState;
        // Collect underlying iterator "done" signals as a side effect in
        // getNext()
        let numIterators = 0;
        let iteratorsDone = 0;
        function getNext(container) {
            if (container instanceof LazyIterator) {
                const result = container.next();
                return {
                    value: result.then(x => {
                        numIterators++;
                        if (x.done) {
                            iteratorsDone++;
                        }
                        return x.value;
                    }),
                    recurse: false
                };
            }
            else {
                return { value: null, recurse: true };
            }
        }
        const mapped = await deepMapAndAwaitAll(this.iterators, getNext);
        if (numIterators === iteratorsDone) {
            // The streams have all ended.
            return { value: null, done: true };
        }
        if (iteratorsDone > 0) {
            switch (this.mismatchMode) {
                case ZipMismatchMode.FAIL:
                    throw new Error('Zipped streams should have the same length. ' +
                        `Mismatched at element ${this.count}.`);
                case ZipMismatchMode.SHORTEST:
                    return { value: null, done: true };
                case ZipMismatchMode.LONGEST:
                default:
                // Continue.  The exhausted streams already produced value: null.
            }
        }
        this.count++;
        return { value: mapped, done: false };
    }
    async next() {
        this.currentPromise = this.nextState(this.currentPromise);
        return this.currentPromise;
    }
}
// Iterators that maintain a ring buffer of pending promises
// ============================================================================
/**
 * A stream that prefetches a given number of items from an upstream source,
 * returning them in FIFO order.
 *
 * Note this prefetches Promises, but makes no guarantees about when those
 * Promises resolve.
 */
export class PrefetchIterator extends LazyIterator {
    constructor(upstream, bufferSize) {
        super();
        this.upstream = upstream;
        this.bufferSize = bufferSize;
        this.buffer = new RingBuffer(bufferSize);
    }
    summary() {
        return `${this.upstream.summary()} -> Prefetch`;
    }
    /**
     * Refill the prefetch buffer.  Returns only after the buffer is full, or
     * the upstream source is exhausted.
     */
    refill() {
        while (!this.buffer.isFull()) {
            const v = this.upstream.next();
            this.buffer.push(v);
        }
    }
    next() {
        this.refill();
        // This shift will never throw an error because the buffer is always
        // full after a refill. If the stream is exhausted, the buffer will be
        // full of Promises that will resolve to the end-of-stream signal.
        return this.buffer.shift();
    }
}
/**
 * A stream that performs a sliding-window random shuffle on an upstream
 * source. This is like a `PrefetchIterator` except that the items are
 * returned in randomized order.  Mixing naturally improves as the buffer
 * size increases.
 */
export class ShuffleIterator extends PrefetchIterator {
    constructor(upstream, windowSize, seed) {
        super(upstream, windowSize);
        this.upstream = upstream;
        this.windowSize = windowSize;
        // Local state that should not be clobbered by out-of-order execution.
        this.upstreamExhausted = false;
        this.random = seedrandom.alea(seed || tf.util.now().toString());
        this.lastRead = Promise.resolve({ value: null, done: false });
    }
    async next() {
        // This sets this.lastRead to a new Promise right away, as opposed to
        // saying `await this.lastRead; this.lastRead = this.serialNext();` which
        // would not work because this.nextRead would be updated only after the
        // promise resolves.
        this.lastRead = this.lastRead.then(() => this.serialNext());
        return this.lastRead;
    }
    randomInt(max) {
        return Math.floor(this.random() * max);
    }
    chooseIndex() {
        return this.randomInt(this.buffer.length());
    }
    async serialNext() {
        // TODO(soergel): consider performance
        if (!this.upstreamExhausted) {
            this.refill();
        }
        while (!this.buffer.isEmpty()) {
            const chosenIndex = this.chooseIndex();
            const result = await this.buffer.shuffleExcise(chosenIndex);
            if (result.done) {
                this.upstreamExhausted = true;
            }
            else {
                this.refill();
                return result;
            }
        }
        return { value: null, done: true };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF6eV9pdGVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtZGF0YS9zcmMvaXRlcmF0b3JzL2xhenlfaXRlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVDLE9BQU8sS0FBSyxVQUFVLE1BQU0sWUFBWSxDQUFDO0FBR3pDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM3QyxPQUFPLEVBQUMsa0JBQWtCLEVBQXFDLE9BQU8sRUFBRSxTQUFTLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUMzRyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFPL0Msb0RBQW9EO0FBQ3BELGtFQUFrRTtBQUNsRSwwREFBMEQ7QUFFMUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUksS0FBVTtJQUM3QyxPQUFPLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxLQUFhO0lBQ3BELElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUNkLE9BQU8sb0JBQW9CLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsb0JBQW9CLENBQ2hDLElBQ2lEO0lBQ25ELE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dB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QUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQzthQUMvQjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2QsT0FBTyxNQUFNLENBQUM7YUFDZjtTQUNGO1FBQ0QsT0FBTyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0lBQ25DLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQgKiBhcyBzZWVkcmFuZG9tIGZyb20gJ3NlZWRyYW5kb20nO1xuXG5pbXBvcnQge0NvbnRhaW5lcn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtkZWVwQ2xvbmV9IGZyb20gJy4uL3V0aWwvZGVlcF9jbG9uZSc7XG5pbXBvcnQge2RlZXBNYXBBbmRBd2FpdEFsbCwgRGVlcE1hcEFzeW5jUmVzdWx0LCBEZWVwTWFwUmVzdWx0LCBkZWVwWmlwLCB6aXBUb0xpc3R9IGZyb20gJy4uL3V0aWwvZGVlcF9tYXAnO1xuaW1wb3J0IHtHcm93aW5nUmluZ0J1ZmZlcn0gZnJvbSAnLi4vdXRpbC9ncm93aW5nX3JpbmdfYnVmZmVyJztcbmltcG9ydCB7UmluZ0J1ZmZlcn0gZnJvbSAnLi4vdXRpbC9yaW5nX2J1ZmZlcic7XG5cbi8qKlxuICogQSBuZXN0ZWQgc3RydWN0dXJlIG9mIExhenlJdGVyYXRvcnMsIHVzZWQgYXMgdGhlIGlucHV0IHRvIHppcCgpLlxuICovXG5leHBvcnQgdHlwZSBJdGVyYXRvckNvbnRhaW5lciA9IENvbnRhaW5lcjxMYXp5SXRlcmF0b3I8dGYuVGVuc29yQ29udGFpbmVyPj47XG5cbi8vIEhlcmUgd2UgaW1wbGVtZW50IGEgc2ltcGxlIGFzeW5jaHJvbm91cyBpdGVyYXRvci5cbi8vIFRoaXMgbGV0cyB1cyBhdm9pZCB1c2luZyBlaXRoZXIgdGhpcmQtcGFydHkgc3RyZWFtIGxpYnJhcmllcyBvclxuLy8gcmVjZW50IFR5cGVTY3JpcHQgbGFuZ3VhZ2Ugc3VwcG9ydCByZXF1aXJpbmcgcG9seWZpbGxzLlxuXG4vKipcbiAqIENyZWF0ZSBhIGBMYXp5SXRlcmF0b3JgIGZyb20gYW4gYXJyYXkgb2YgaXRlbXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpdGVyYXRvckZyb21JdGVtczxUPihpdGVtczogVFtdKTogTGF6eUl0ZXJhdG9yPFQ+IHtcbiAgcmV0dXJuIG5ldyBBcnJheUl0ZXJhdG9yKGl0ZW1zKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBgTGF6eUl0ZXJhdG9yYCBvZiBpbmNyZW1lbnRpbmcgaW50ZWdlcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpdGVyYXRvckZyb21JbmNyZW1lbnRpbmcoc3RhcnQ6IG51bWJlcik6IExhenlJdGVyYXRvcjxudW1iZXI+IHtcbiAgbGV0IGkgPSBzdGFydDtcbiAgcmV0dXJuIGl0ZXJhdG9yRnJvbUZ1bmN0aW9uKCgpID0+ICh7dmFsdWU6IGkrKywgZG9uZTogZmFsc2V9KSk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYExhenlJdGVyYXRvcmAgZnJvbSBhIGZ1bmN0aW9uLlxuICpcbiAqIGBgYGpzXG4gKiBsZXQgaSA9IC0xO1xuICogY29uc3QgZnVuYyA9ICgpID0+XG4gKiAgICArK2kgPCA1ID8ge3ZhbHVlOiBpLCBkb25lOiBmYWxzZX0gOiB7dmFsdWU6IG51bGwsIGRvbmU6IHRydWV9O1xuICogY29uc3QgaXRlciA9IHRmLmRhdGEuaXRlcmF0b3JGcm9tRnVuY3Rpb24oZnVuYyk7XG4gKiBhd2FpdCBpdGVyLmZvckVhY2hBc3luYyhlID0+IGNvbnNvbGUubG9nKGUpKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBmdW5jIEEgZnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBkYXRhIG9uIGVhY2ggY2FsbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGl0ZXJhdG9yRnJvbUZ1bmN0aW9uPFQ+KFxuICAgIGZ1bmM6ICgpID0+XG4gICAgICAgIEl0ZXJhdG9yUmVzdWx0PFQ+fCBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFQ+Pik6IExhenlJdGVyYXRvcjxUPiB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb25DYWxsSXRlcmF0b3IoZnVuYyk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYExhenlJdGVyYXRvcmAgYnkgY29uY2F0ZW5hdGluZyB1bmRlcmx5aW5nIHN0cmVhbXMsIHdoaWNoIGFyZVxuICogdGhlbXNlbHZlcyBwcm92aWRlZCBhcyBhIHN0cmVhbS5cbiAqXG4gKiBUaGlzIGNhbiBhbHNvIGJlIHRob3VnaHQgb2YgYXMgYSBcInN0cmVhbSBmbGF0dGVuXCIgb3BlcmF0aW9uLlxuICpcbiAqIEBwYXJhbSBiYXNlSXRlcmF0b3JzIEEgc3RyZWFtIG9mIHN0cmVhbXMgdG8gYmUgY29uY2F0ZW5hdGVkLlxuICogQHBhcmFtIGJhc2VFcnJvckhhbmRsZXIgQW4gb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCBjYW4gaW50ZXJjZXB0IGBFcnJvcmBzXG4gKiAgIHJhaXNlZCBkdXJpbmcgYSBgbmV4dCgpYCBjYWxsIG9uIHRoZSBiYXNlIHN0cmVhbS4gIFRoaXMgZnVuY3Rpb24gY2FuIGRlY2lkZVxuICogICB3aGV0aGVyIHRoZSBlcnJvciBzaG91bGQgYmUgcHJvcGFnYXRlZCwgd2hldGhlciB0aGUgZXJyb3Igc2hvdWxkIGJlXG4gKiAgIGlnbm9yZWQsIG9yIHdoZXRoZXIgdGhlIGJhc2Ugc3RyZWFtIHNob3VsZCBiZSB0ZXJtaW5hdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXRlcmF0b3JGcm9tQ29uY2F0ZW5hdGVkPFQ+KFxuICAgIGJhc2VJdGVyYXRvcnM6IExhenlJdGVyYXRvcjxMYXp5SXRlcmF0b3I8VD4+LFxuICAgIGJhc2VFcnJvckhhbmRsZXI/OiAoZTogRXJyb3IpID0+IGJvb2xlYW4pOiBMYXp5SXRlcmF0b3I8VD4ge1xuICByZXR1cm4gbmV3IENoYWluZWRJdGVyYXRvcihiYXNlSXRlcmF0b3JzLCBiYXNlRXJyb3JIYW5kbGVyKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBgTGF6eUl0ZXJhdG9yYCBieSBjb25jYXRlbmF0aW5nIHN0cmVhbXMgcHJvZHVjZWQgYnkgY2FsbGluZyBhXG4gKiBzdHJlYW0tZ2VuZXJhdGluZyBmdW5jdGlvbiBhIGdpdmVuIG51bWJlciBvZiB0aW1lcy5cbiAqXG4gKiBTaW5jZSBhIGBMYXp5SXRlcmF0b3JgIGlzIHJlYWQtb25jZSwgaXQgY2Fubm90IGJlIHJlcGVhdGVkLCBidXQgdGhpc1xuICogZnVuY3Rpb24gY2FuIGJlIHVzZWQgdG8gYWNoaWV2ZSBhIHNpbWlsYXIgZWZmZWN0OlxuICpcbiAqICAgTGF6eUl0ZXJhdG9yLm9mQ29uY2F0ZW5hdGVkRnVuY3Rpb24oKCkgPT4gbmV3IE15SXRlcmF0b3IoKSwgNik7XG4gKlxuICogQHBhcmFtIGl0ZXJhdG9yRnVuYzogQSBmdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGEgbmV3IHN0cmVhbSBvbiBlYWNoIGNhbGwuXG4gKiBAcGFyYW0gY291bnQ6IFRoZSBudW1iZXIgb2YgdGltZXMgdG8gY2FsbCB0aGUgZnVuY3Rpb24uXG4gKiBAcGFyYW0gYmFzZUVycm9ySGFuZGxlciBBbiBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IGNhbiBpbnRlcmNlcHQgYEVycm9yYHNcbiAqICAgcmFpc2VkIGR1cmluZyBhIGBuZXh0KClgIGNhbGwgb24gdGhlIGJhc2Ugc3RyZWFtLiAgVGhpcyBmdW5jdGlvbiBjYW4gZGVjaWRlXG4gKiAgIHdoZXRoZXIgdGhlIGVycm9yIHNob3VsZCBiZSBwcm9wYWdhdGVkLCB3aGV0aGVyIHRoZSBlcnJvciBzaG91bGQgYmVcbiAqICAgaWdub3JlZCwgb3Igd2hldGhlciB0aGUgYmFzZSBzdHJlYW0gc2hvdWxkIGJlIHRlcm1pbmF0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpdGVyYXRvckZyb21Db25jYXRlbmF0ZWRGdW5jdGlvbjxUPihcbiAgICBpdGVyYXRvckZ1bmM6ICgpID0+IEl0ZXJhdG9yUmVzdWx0PExhenlJdGVyYXRvcjxUPj4sIGNvdW50OiBudW1iZXIsXG4gICAgYmFzZUVycm9ySGFuZGxlcj86IChlOiBFcnJvcikgPT4gYm9vbGVhbik6IExhenlJdGVyYXRvcjxUPiB7XG4gIHJldHVybiBpdGVyYXRvckZyb21Db25jYXRlbmF0ZWQoXG4gICAgICBpdGVyYXRvckZyb21GdW5jdGlvbihpdGVyYXRvckZ1bmMpLnRha2UoY291bnQpLCBiYXNlRXJyb3JIYW5kbGVyKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBgTGF6eUl0ZXJhdG9yYCBieSB6aXBwaW5nIHRvZ2V0aGVyIGFuIGFycmF5LCBkaWN0LCBvciBuZXN0ZWRcbiAqIHN0cnVjdHVyZSBvZiBgTGF6eUl0ZXJhdG9yYHMgKGFuZCBwZXJoYXBzIGFkZGl0aW9uYWwgY29uc3RhbnRzKS5cbiAqXG4gKiBUaGUgdW5kZXJseWluZyBzdHJlYW1zIG11c3QgcHJvdmlkZSBlbGVtZW50cyBpbiBhIGNvbnNpc3RlbnQgb3JkZXIgc3VjaFxuICogdGhhdCB0aGV5IGNvcnJlc3BvbmQuXG4gKlxuICogVHlwaWNhbGx5LCB0aGUgdW5kZXJseWluZyBzdHJlYW1zIHNob3VsZCBoYXZlIHRoZSBzYW1lIG51bWJlciBvZlxuICogZWxlbWVudHMuIElmIHRoZXkgZG8gbm90LCB0aGUgYmVoYXZpb3IgaXMgZGV0ZXJtaW5lZCBieSB0aGVcbiAqIGBtaXNtYXRjaE1vZGVgIGFyZ3VtZW50LlxuICpcbiAqIFRoZSBuZXN0ZWQgc3RydWN0dXJlIG9mIHRoZSBgaXRlcmF0b3JzYCBhcmd1bWVudCBkZXRlcm1pbmVzIHRoZVxuICogc3RydWN0dXJlIG9mIGVsZW1lbnRzIGluIHRoZSByZXN1bHRpbmcgaXRlcmF0b3IuXG4gKlxuICogQHBhcmFtIGl0ZXJhdG9yczogQW4gYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5pbmcgTGF6eUl0ZXJhdG9ycyBhdCB0aGVcbiAqIGxlYXZlcy5cbiAqIEBwYXJhbSBtaXNtYXRjaE1vZGU6IERldGVybWluZXMgd2hhdCB0byBkbyB3aGVuIG9uZSB1bmRlcmx5aW5nIGl0ZXJhdG9yXG4gKiBpcyBleGhhdXN0ZWQgYmVmb3JlIHRoZSBvdGhlcnMuICBgWmlwTWlzbWF0Y2hNb2RlLkZBSUxgICh0aGUgZGVmYXVsdClcbiAqIGNhdXNlcyBhbiBlcnJvciB0byBiZSB0aHJvd24gaW4gdGhpcyBjYXNlLiAgYFppcE1pc21hdGNoTW9kZS5TSE9SVEVTVGBcbiAqIGNhdXNlcyB0aGUgemlwcGVkIGl0ZXJhdG9yIHRvIHRlcm1pbmF0ZSB3aXRoIHRoZSBmdXJzdCB1bmRlcmx5aW5nXG4gKiBzdHJlYW1zLCBzbyBlbGVtZW50cyByZW1haW5pbmcgb24gdGhlIGxvbmdlciBzdHJlYW1zIGFyZSBpZ25vcmVkLlxuICogYFppcE1pc21hdGNoTW9kZS5MT05HRVNUYCBjYXVzZXMgdGhlIHppcHBlZCBzdHJlYW0gdG8gY29udGludWUsIGZpbGxpbmdcbiAqIGluIG51bGxzIGZvciB0aGUgZXhoYXVzdGVkIHN0cmVhbXMsIHVudGlsIGFsbCBzdHJlYW1zIGFyZSBleGhhdXN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpdGVyYXRvckZyb21aaXBwZWQ8TyBleHRlbmRzIHRmLlRlbnNvckNvbnRhaW5lcj4oXG4gICAgaXRlcmF0b3JzOiBJdGVyYXRvckNvbnRhaW5lcixcbiAgICBtaXNtYXRjaE1vZGU6IFppcE1pc21hdGNoTW9kZSA9IFppcE1pc21hdGNoTW9kZS5GQUlMKTogTGF6eUl0ZXJhdG9yPE8+IHtcbiAgcmV0dXJuIG5ldyBaaXBJdGVyYXRvcjxPPihpdGVyYXRvcnMsIG1pc21hdGNoTW9kZSk7XG59XG5cbi8qKlxuICogQW4gYXN5bmNocm9ub3VzIGl0ZXJhdG9yLCBwcm92aWRpbmcgbGF6eSBhY2Nlc3MgdG8gYSBwb3RlbnRpYWxseVxuICogdW5ib3VuZGVkIHN0cmVhbSBvZiBlbGVtZW50cy5cbiAqXG4gKiBJdGVyYXRvciBjYW4gYmUgb2J0YWluZWQgZnJvbSBhIGRhdGFzZXQ6XG4gKiBgY29uc3QgaXRlciA9IGF3YWl0IGRhdGFzZXQuaXRlcmF0b3IoKTtgXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMYXp5SXRlcmF0b3I8VD4ge1xuICAvLyBUaGlzIGNsYXNzIGltcGxlbWVudHMgQXN5bmNJdGVyYXRvcjxUPiwgYnV0IHdlIGhhdmUgbm90IHlldCBzZXQgdGhlXG4gIC8vIFR5cGVTY3JpcHQgLS1kb3dubGV2ZWxJdGVyYXRpb24gZmxhZyB0byBlbmFibGUgdGhhdC5cblxuICBhYnN0cmFjdCBzdW1tYXJ5KCk6IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJucyBhIGBQcm9taXNlYCBmb3IgdGhlIG5leHQgZWxlbWVudCBpbiB0aGUgc3RyZWFtLlxuICAgKlxuICAgKiBXaGVuIGFuIGl0ZW0gY2FuIGJlIHByb3ZpZGVkIHN1Y2Nlc3NmdWxseSwgdGhlIHJldHVybiB2YWx1ZSBpc1xuICAgKiBge3ZhbHVlOlQsIGRvbmU6ZmFsc2V9YC5cbiAgICpcbiAgICogQ2FsbGluZyBuZXh0KCkgb24gYSBjbG9zZWQgc3RyZWFtIHJldHVybnMgYHt2YWx1ZTpudWxsLCBkb25lOnRydWV9YC5cbiAgICovXG4gIGFic3RyYWN0IGFzeW5jIG5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj47XG5cbiAgLyoqXG4gICAqIENvbGxlY3QgYWxsIHJlbWFpbmluZyBlbGVtZW50cyBvZiBhIGJvdW5kZWQgc3RyZWFtIGludG8gYW4gYXJyYXkuXG4gICAqIE9idmlvdXNseSB0aGlzIHdpbGwgc3VjY2VlZCBvbmx5IGZvciBzbWFsbCBzdHJlYW1zIHRoYXQgZml0IGluIG1lbW9yeS5cbiAgICogVXNlZnVsIGZvciB0ZXN0aW5nLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIFByb21pc2UgZm9yIGFuIGFycmF5IG9mIHN0cmVhbSBlbGVtZW50cywgd2hpY2ggd2lsbCByZXNvbHZlXG4gICAqICAgd2hlbiB0aGUgc3RyZWFtIGlzIGV4aGF1c3RlZC5cbiAgICovXG4gIGFzeW5jIHRvQXJyYXkoKTogUHJvbWlzZTxUW10+IHtcbiAgICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xuICAgIGxldCB4ID0gYXdhaXQgdGhpcy5uZXh0KCk7XG4gICAgd2hpbGUgKCF4LmRvbmUpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHgudmFsdWUpO1xuICAgICAgeCA9IGF3YWl0IHRoaXMubmV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3QgYWxsIGVsZW1lbnRzIG9mIHRoaXMgZGF0YXNldCBpbnRvIGFuIGFycmF5IHdpdGggcHJlZmV0Y2hpbmcgMTAwXG4gICAqIGVsZW1lbnRzLiBUaGlzIGlzIHVzZWZ1bCBmb3IgdGVzdGluZywgYmVjYXVzZSB0aGUgcHJlZmV0Y2ggY2hhbmdlcyB0aGVcbiAgICogb3JkZXIgaW4gd2hpY2ggdGhlIFByb21pc2VzIGFyZSByZXNvbHZlZCBhbG9uZyB0aGUgcHJvY2Vzc2luZyBwaXBlbGluZS5cbiAgICogVGhpcyBtYXkgaGVscCBleHBvc2UgYnVncyB3aGVyZSByZXN1bHRzIGFyZSBkZXBlbmRlbnQgb24gdGhlIG9yZGVyIG9mXG4gICAqIFByb21pc2UgcmVzb2x1dGlvbiByYXRoZXIgdGhhbiBvbiB0aGUgbG9naWNhbCBvcmRlciBvZiB0aGUgc3RyZWFtIChpLmUuLFxuICAgKiBkdWUgdG8gaGlkZGVuIG11dGFibGUgc3RhdGUpLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIFByb21pc2UgZm9yIGFuIGFycmF5IG9mIHN0cmVhbSBlbGVtZW50cywgd2hpY2ggd2lsbCByZXNvbHZlXG4gICAqICAgd2hlbiB0aGUgc3RyZWFtIGlzIGV4aGF1c3RlZC5cbiAgICovXG4gIGFzeW5jIHRvQXJyYXlGb3JUZXN0KCk6IFByb21pc2U8VFtdPiB7XG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy5wcmVmZXRjaCgxMDApO1xuICAgIGNvbnN0IHJlc3VsdDogVFtdID0gW107XG4gICAgbGV0IHggPSBhd2FpdCBzdHJlYW0ubmV4dCgpO1xuICAgIHdoaWxlICgheC5kb25lKSB7XG4gICAgICByZXN1bHQucHVzaCh4LnZhbHVlKTtcbiAgICAgIHggPSBhd2FpdCBzdHJlYW0ubmV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgaXRlbXMgZnJvbSB0aGUgc3RyZWFtIHVudGlsIGl0IGlzIGV4aGF1c3RlZC5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZnVsIHdoZW4gdGhlIHN0cmVhbSBoYXMgc2lkZSBlZmZlY3RzIGJ1dCBubyBvdXRwdXQuICBJblxuICAgKiB0aGF0IGNhc2UsIGNhbGxpbmcgdGhpcyBmdW5jdGlvbiBndWFyYW50ZWVzIHRoYXQgdGhlIHN0cmVhbSB3aWxsIGJlXG4gICAqIGZ1bGx5IHByb2Nlc3NlZC5cbiAgICovXG4gIGFzeW5jIHJlc29sdmVGdWxseSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgeCA9IGF3YWl0IHRoaXMubmV4dCgpO1xuICAgIHdoaWxlICgheC5kb25lKSB7XG4gICAgICB4ID0gYXdhaXQgdGhpcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgaXRlbXMgZnJvbSB0aGUgc3RyZWFtIHVudGlsIGl0IGlzIGV4aGF1c3RlZCwgb3IgYSBwcmVkaWNhdGUgZmFpbHMuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWZ1bCB3aGVuIHRoZSBzdHJlYW0gaGFzIHNpZGUgZWZmZWN0cyBidXQgbm8gb3V0cHV0LiAgSW5cbiAgICogdGhhdCBjYXNlLCBjYWxsaW5nIHRoaXMgZnVuY3Rpb24gZ3VhcmFudGVlcyB0aGF0IHRoZSBzdHJlYW0gd2lsbCBiZVxuICAgKiBmdWxseSBwcm9jZXNzZWQuXG4gICAqL1xuICBhc3luYyByZXNvbHZlV2hpbGUocHJlZGljYXRlOiAocjogVCkgPT4gYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCB4ID0gYXdhaXQgdGhpcy5uZXh0KCk7XG4gICAgbGV0IHNob3VsZENvbnRpbnVlID0gcHJlZGljYXRlKHgudmFsdWUpO1xuICAgIHdoaWxlICgoIXguZG9uZSkgJiYgc2hvdWxkQ29udGludWUpIHtcbiAgICAgIHggPSBhd2FpdCB0aGlzLm5leHQoKTtcbiAgICAgIHNob3VsZENvbnRpbnVlID0gcHJlZGljYXRlKHgudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGVycm9ycyB0aHJvd24gb24gdGhpcyBzdHJlYW0gdXNpbmcgYSBwcm92aWRlZCBoYW5kbGVyIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gaGFuZGxlciBBIGZ1bmN0aW9uIHRoYXQgaGFuZGxlcyBhbnkgYEVycm9yYCB0aHJvd24gZHVyaW5nIGEgYG5leHQoKWBcbiAgICogICBjYWxsIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIHN0cmVhbSBzaG91bGQgY29udGludWUgKGRyb3BwaW5nIHRoZSBmYWlsZWRcbiAgICogICBjYWxsKSBvciBmYWxzZSBpZiB0aGUgc3RyZWFtIHNob3VsZCBxdWlldGx5IHRlcm1pbmF0ZS4gIElmIHRoZSBoYW5kbGVyXG4gICAqICAgaXRzZWxmIHRocm93cyAob3IgcmV0aHJvd3MpIGFuIGBFcnJvcmAsIHRoYXQgd2lsbCBiZSBwcm9wYWdhdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGBMYXp5SXRlcmF0b3JgIG9mIGVsZW1lbnRzIHBhc3NlZCB0aHJvdWdoIGZyb20gdXBzdHJlYW0sXG4gICAqICAgcG9zc2libHkgZmlsdGVyaW5nIG9yIHRlcm1pbmF0aW5nIG9uIHVwc3RyZWFtIGBuZXh0KClgIGNhbGxzIHRoYXRcbiAgICogICB0aHJvdyBhbiBgRXJyb3JgLlxuICAgKi9cbiAgaGFuZGxlRXJyb3JzKGhhbmRsZXI6IChlcnJvcjogRXJyb3IpID0+IGJvb2xlYW4pOiBMYXp5SXRlcmF0b3I8VD4ge1xuICAgIHJldHVybiBuZXcgRXJyb3JIYW5kbGluZ0xhenlJdGVyYXRvcih0aGlzLCBoYW5kbGVyKTtcbiAgfVxuXG4gIC8vIFRPRE8oc29lcmdlbCk6IEltcGxlbWVudCByZWR1Y2UoKSBldGMuXG5cbiAgLyoqXG4gICAqIEZpbHRlcnMgdGhpcyBzdHJlYW0gYWNjb3JkaW5nIHRvIGBwcmVkaWNhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gbWFwcGluZyBhIHN0cmVhbSBlbGVtZW50IHRvIGEgYm9vbGVhbiBvciBhXG4gICAqIGBQcm9taXNlYCBmb3Igb25lLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGBMYXp5SXRlcmF0b3JgIG9mIGVsZW1lbnRzIGZvciB3aGljaCB0aGUgcHJlZGljYXRlIHdhcyB0cnVlLlxuICAgKi9cbiAgZmlsdGVyKHByZWRpY2F0ZTogKHZhbHVlOiBUKSA9PiBib29sZWFuKTogTGF6eUl0ZXJhdG9yPFQ+IHtcbiAgICByZXR1cm4gbmV3IEZpbHRlckl0ZXJhdG9yKHRoaXMsIHByZWRpY2F0ZSk7XG4gIH1cblxuICAvKipcbiAgICogTWFwcyB0aGlzIHN0cmVhbSB0aHJvdWdoIGEgMS10by0xIHRyYW5zZm9ybS5cbiAgICpcbiAgICogQHBhcmFtIHRyYW5zZm9ybSBBIGZ1bmN0aW9uIG1hcHBpbmcgYSBzdHJlYW0gZWxlbWVudCB0byBhIHRyYW5zZm9ybWVkXG4gICAqICAgZWxlbWVudC5cbiAgICpcbiAgICogQHJldHVybnMgQSBgTGF6eUl0ZXJhdG9yYCBvZiB0cmFuc2Zvcm1lZCBlbGVtZW50cy5cbiAgICovXG4gIG1hcDxPPih0cmFuc2Zvcm06ICh2YWx1ZTogVCkgPT4gTyk6IExhenlJdGVyYXRvcjxPPiB7XG4gICAgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcih0aGlzLCB0cmFuc2Zvcm0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcHMgdGhpcyBzdHJlYW0gdGhyb3VnaCBhbiBhc3luYyAxLXRvLTEgdHJhbnNmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0gdHJhbnNmb3JtIEEgZnVuY3Rpb24gbWFwcGluZyBhIHN0cmVhbSBlbGVtZW50IHRvIGEgYFByb21pc2VgIGZvciBhXG4gICAqICAgdHJhbnNmb3JtZWQgc3RyZWFtIGVsZW1lbnQuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgYExhenlJdGVyYXRvcmAgb2YgdHJhbnNmb3JtZWQgZWxlbWVudHMuXG4gICAqL1xuICBtYXBBc3luYzxPPih0cmFuc2Zvcm06ICh2YWx1ZTogVCkgPT4gUHJvbWlzZTxPPik6IExhenlJdGVyYXRvcjxPPiB7XG4gICAgcmV0dXJuIG5ldyBBc3luY01hcEl0ZXJhdG9yKHRoaXMsIHRyYW5zZm9ybSk7XG4gIH1cblxuICAvKipcbiAgICogTWFwcyB0aGlzIHN0cmVhbSB0aHJvdWdoIGEgMS10by0xIHRyYW5zZm9ybSwgZm9yY2luZyBzZXJpYWwgZXhlY3V0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gdHJhbnNmb3JtIEEgZnVuY3Rpb24gbWFwcGluZyBhIHN0cmVhbSBlbGVtZW50IHRvIGEgdHJhbnNmb3JtZWRcbiAgICogICBlbGVtZW50LlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGBMYXp5SXRlcmF0b3JgIG9mIHRyYW5zZm9ybWVkIGVsZW1lbnRzLlxuICAgKi9cbiAgc2VyaWFsTWFwQXN5bmM8Tz4odHJhbnNmb3JtOiAodmFsdWU6IFQpID0+IFByb21pc2U8Tz4pOiBMYXp5SXRlcmF0b3I8Tz4ge1xuICAgIHJldHVybiBuZXcgQXN5bmNNYXBJdGVyYXRvcih0aGlzLCB0cmFuc2Zvcm0pLnNlcmlhbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcHMgdGhpcyBzdHJlYW0gdGhyb3VnaCBhIDEtdG8tbWFueSB0cmFuc2Zvcm0uXG4gICAqXG4gICAqIEBwYXJhbSB0cmFuc2Zvcm0gQSBmdW5jdGlvbiBtYXBwaW5nIGEgc3RyZWFtIGVsZW1lbnQgdG8gYW4gYXJyYXkgb2ZcbiAgICogICB0cmFuc2Zvcm1lZCBlbGVtZW50cy5cbiAgICpcbiAgICogQHJldHVybnMgQSBgRGF0YVN0cmVhbWAgb2YgdHJhbnNmb3JtZWQgZWxlbWVudHMuXG4gICAqL1xuICBmbGF0bWFwPE8+KHRyYW5zZm9ybTogKHZhbHVlOiBUKSA9PiBPW10pOiBMYXp5SXRlcmF0b3I8Tz4ge1xuICAgIHJldHVybiBuZXcgRmxhdG1hcEl0ZXJhdG9yKHRoaXMsIHRyYW5zZm9ybSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgYSBmdW5jdGlvbiB0byBldmVyeSBlbGVtZW50IG9mIHRoZSBzdHJlYW0uXG4gICAqXG4gICAqIEBwYXJhbSBmIEEgZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBzdHJlYW0gZWxlbWVudC5cbiAgICovXG4gIGFzeW5jIGZvckVhY2hBc3luYyhmOiAodmFsdWU6IFQpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZikucmVzb2x2ZUZ1bGx5KCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgYSBmdW5jdGlvbiB0byBldmVyeSBlbGVtZW50IG9mIHRoZSBzdHJlYW0sIGZvcmNpbmcgc2VyaWFsIGV4ZWN1dGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGYgQSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIHN0cmVhbSBlbGVtZW50LiAgU2hvdWxkIHJldHVybiAndHJ1ZSdcbiAgICogICB0byBpbmRpY2F0ZSB0aGF0IHRoZSBzdHJlYW0gc2hvdWxkIGNvbnRpbnVlLCBvciAnZmFsc2UnIHRvIGNhdXNlIGl0IHRvXG4gICAqICAgdGVybWluYXRlLlxuICAgKi9cbiAgYXN5bmMgc2VyaWFsRm9yRWFjaChmOiAodmFsdWU6IFQpID0+IFByb21pc2U8Ym9vbGVhbj4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJpYWxNYXBBc3luYyhmKS5yZXNvbHZlV2hpbGUoeCA9PiAoeCA9PT0gdHJ1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyb3VwcyBlbGVtZW50cyBpbnRvIGJhdGNoZXMsIHJlcHJlc2VudGVkIGFzIGFycmF5cyBvZiBlbGVtZW50cy5cbiAgICpcbiAgICogV2UgY2FuIHRoaW5rIG9mIHRoZSBlbGVtZW50cyBvZiB0aGlzIGl0ZXJhdG9yIGFzICdyb3dzJyAoZXZlbiBpZiB0aGV5IGFyZVxuICAgKiBuZXN0ZWQgc3RydWN0dXJlcykuICBCeSB0aGUgc2FtZSB0b2tlbiwgY29uc2VjdXRpdmUgdmFsdWVzIGZvciBhIGdpdmVuXG4gICAqIGtleSB3aXRoaW4gdGhlIGVsZW1lbnRzIGZvcm0gYSAnY29sdW1uJy4gIFRoaXMgbWF0Y2hlcyB0aGUgdXN1YWwgc2Vuc2Ugb2ZcbiAgICogJ3JvdycgYW5kICdjb2x1bW4nIHdoZW4gcHJvY2Vzc2luZyB0YWJ1bGFyIGRhdGEgKGUuZy4sIHBhcnNpbmcgYSBDU1YpLlxuICAgKlxuICAgKiBUaHVzLCBcIlJvdy1tYWpvclwiIG1lYW5zIHRoYXQgdGhlIHJlc3VsdGluZyBiYXRjaCBpcyBzaW1wbHkgYSBjb2xsZWN0aW9uIG9mXG4gICAqIHJvd3M6IGBbcm93MSwgcm93Miwgcm93MywgLi4uXWAuICBUaGlzIGlzIGNvbnRyYXN0IHRvIHRoZSBjb2x1bW4tbWFqb3JcbiAgICogZm9ybSwgd2hpY2ggaXMgbmVlZGVkIGZvciB2ZWN0b3JpemVkIGNvbXB1dGF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gYmF0Y2hTaXplIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgZGVzaXJlZCBwZXIgYmF0Y2guXG4gICAqIEBwYXJhbSBzbWFsbExhc3RCYXRjaCBXaGV0aGVyIHRvIGVtaXQgdGhlIGZpbmFsIGJhdGNoIHdoZW4gaXQgaGFzIGZld2VyXG4gICAqICAgdGhhbiBiYXRjaFNpemUgZWxlbWVudHMuIERlZmF1bHQgdHJ1ZS5cbiAgICogQHJldHVybnMgQSBgTGF6eUl0ZXJhdG9yYCBvZiBiYXRjaGVzIG9mIGVsZW1lbnRzLCByZXByZXNlbnRlZCBhcyBhcnJheXNcbiAgICogICBvZiB0aGUgb3JpZ2luYWwgZWxlbWVudCB0eXBlLlxuICAgKi9cbiAgcm93TWFqb3JCYXRjaChiYXRjaFNpemU6IG51bWJlciwgc21hbGxMYXN0QmF0Y2ggPSB0cnVlKTogTGF6eUl0ZXJhdG9yPFRbXT4ge1xuICAgIHJldHVybiBuZXcgUm93TWFqb3JCYXRjaEl0ZXJhdG9yKHRoaXMsIGJhdGNoU2l6ZSwgc21hbGxMYXN0QmF0Y2gpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyb3VwcyBlbGVtZW50cyBpbnRvIGJhdGNoZXMsIHJlcHJlc2VudGVkIGluIGNvbHVtbi1tYWpvciBmb3JtLlxuICAgKlxuICAgKiBXZSBjYW4gdGhpbmsgb2YgdGhlIGVsZW1lbnRzIG9mIHRoaXMgaXRlcmF0b3IgYXMgJ3Jvd3MnIChldmVuIGlmIHRoZXkgYXJlXG4gICAqIG5lc3RlZCBzdHJ1Y3R1cmVzKS4gIEJ5IHRoZSBzYW1lIHRva2VuLCBjb25zZWN1dGl2ZSB2YWx1ZXMgZm9yIGEgZ2l2ZW5cbiAgICoga2V5IHdpdGhpbiB0aGUgZWxlbWVudHMgZm9ybSBhICdjb2x1bW4nLiAgVGhpcyBtYXRjaGVzIHRoZSB1c3VhbCBzZW5zZSBvZlxuICAgKiAncm93JyBhbmQgJ2NvbHVtbicgd2hlbiBwcm9jZXNzaW5nIHRhYnVsYXIgZGF0YSAoZS5nLiwgcGFyc2luZyBhIENTVikuXG4gICAqXG4gICAqIFRodXMsIFwiY29sdW1uLW1ham9yXCIgbWVhbnMgdGhhdCB0aGUgcmVzdWx0aW5nIGJhdGNoIGlzIGEgKHBvdGVudGlhbGx5XG4gICAqIG5lc3RlZCkgc3RydWN0dXJlIHJlcHJlc2VudGluZyB0aGUgY29sdW1ucy4gIEVhY2ggY29sdW1uIGVudHJ5LCB0aGVuLFxuICAgKiBjb250YWlucyBhIGNvbGxlY3Rpb24gb2YgdGhlIHZhbHVlcyBmb3VuZCBpbiB0aGF0IGNvbHVtbiBmb3IgYSByYW5nZSBvZlxuICAgKiBpbnB1dCBlbGVtZW50cy4gIFRoaXMgcmVwcmVzZW50YXRpb24gYWxsb3dzIGZvciB2ZWN0b3JpemVkIGNvbXB1dGF0aW9uLCBpblxuICAgKiBjb250cmFzdCB0byB0aGUgcm93LW1ham9yIGZvcm0uXG4gICAqXG4gICAqIFRoZSBpbnB1dHMgc2hvdWxkIGFsbCBoYXZlIHRoZSBzYW1lIG5lc3RlZCBzdHJ1Y3R1cmUgKGkuZS4sIG9mIGFycmF5cyBhbmRcbiAgICogZGljdHMpLiAgVGhlIHJlc3VsdCBpcyBhIHNpbmdsZSBvYmplY3Qgd2l0aCB0aGUgc2FtZSBuZXN0ZWQgc3RydWN0dXJlLFxuICAgKiB3aGVyZSB0aGUgbGVhdmVzIGFyZSBhcnJheXMgY29sbGVjdGluZyB0aGUgdmFsdWVzIG9mIHRoZSBpbnB1dHMgYXQgdGhhdFxuICAgKiBsb2NhdGlvbiAob3IsIG9wdGlvbmFsbHksIHRoZSByZXN1bHQgb2YgYSBjdXN0b20gZnVuY3Rpb24gYXBwbGllZCB0byB0aG9zZVxuICAgKiBhcnJheXMpLlxuICAgKlxuICAgKiBAcGFyYW0gYmF0Y2hTaXplIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgZGVzaXJlZCBwZXIgYmF0Y2guXG4gICAqIEBwYXJhbSBzbWFsbExhc3RCYXRjaCBXaGV0aGVyIHRvIGVtaXQgdGhlIGZpbmFsIGJhdGNoIHdoZW4gaXQgaGFzIGZld2VyXG4gICAqICAgdGhhbiBiYXRjaFNpemUgZWxlbWVudHMuIERlZmF1bHQgdHJ1ZS5cbiAgICogQHBhcmFtIHppcEZuOiAob3B0aW9uYWwpIEEgZnVuY3Rpb24gdGhhdCBleHBlY3RzIGFuIGFycmF5IG9mIGVsZW1lbnRzIGF0IGFcbiAgICogICBzaW5nbGUgbm9kZSBvZiB0aGUgb2JqZWN0IHRyZWUsIGFuZCByZXR1cm5zIGEgYERlZXBNYXBSZXN1bHRgLiAgVGhlXG4gICAqICAgYERlZXBNYXBSZXN1bHRgIGVpdGhlciBwcm92aWRlcyBhIHJlc3VsdCB2YWx1ZSBmb3IgdGhhdCBub2RlIChpLmUuLFxuICAgKiAgIHJlcHJlc2VudGluZyB0aGUgc3VidHJlZSksIG9yIGluZGljYXRlcyB0aGF0IHRoZSBub2RlIHNob3VsZCBiZSBwcm9jZXNzZWRcbiAgICogICByZWN1cnNpdmVseS4gIFRoZSBkZWZhdWx0IHppcEZuIHJlY3Vyc2VzIGFzIGZhciBhcyBwb3NzaWJsZSBhbmQgcGxhY2VzXG4gICAqICAgYXJyYXlzIGF0IHRoZSBsZWF2ZXMuXG4gICAqIEByZXR1cm5zIEEgYExhenlJdGVyYXRvcmAgb2YgYmF0Y2hlcyBvZiBlbGVtZW50cywgcmVwcmVzZW50ZWQgYXMgYW4gb2JqZWN0XG4gICAqICAgd2l0aCBjb2xsZWN0aW9ucyBhdCB0aGUgbGVhdmVzLlxuICAgKi9cbiAgY29sdW1uTWFqb3JCYXRjaChcbiAgICAgIGJhdGNoU2l6ZTogbnVtYmVyLCBzbWFsbExhc3RCYXRjaCA9IHRydWUsXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICB6aXBGbjogKHhzOiBhbnlbXSkgPT4gRGVlcE1hcFJlc3VsdCA9IHppcFRvTGlzdCk6XG4gICAgICBMYXp5SXRlcmF0b3I8dGYuVGVuc29yQ29udGFpbmVyPiB7XG4gICAgLy8gRmlyc3QgY29sbGVjdCB0aGUgZGVzaXJlZCBudW1iZXIgb2YgaW5wdXQgZWxlbWVudHMgYXMgYSByb3ctbWFqb3IgYmF0Y2guXG4gICAgY29uc3Qgcm93QmF0Y2hlcyA9IHRoaXMucm93TWFqb3JCYXRjaChiYXRjaFNpemUsIHNtYWxsTGFzdEJhdGNoKTtcbiAgICAvLyBOb3cgJ3JvdGF0ZScgb3IgJ3Bpdm90JyB0aGUgZGF0YSwgY29sbGVjdGluZyBhbGwgdmFsdWVzIGZyb20gZWFjaCBjb2x1bW5cbiAgICAvLyBpbiB0aGUgYmF0Y2ggKGkuZS4sIGZvciBlYWNoIGtleSB3aXRoaW4gdGhlIGVsZW1lbnRzKSBpbnRvIGFuIGFycmF5LlxuICAgIHJldHVybiByb3dCYXRjaGVzLm1hcCh4ID0+IGRlZXBaaXAoeCwgemlwRm4pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25jYXRlbmF0ZSB0aGlzIGBMYXp5SXRlcmF0b3JgIHdpdGggYW5vdGhlci5cbiAgICpcbiAgICogQHBhcmFtIGl0ZXJhdG9yIEEgYExhenlJdGVyYXRvcmAgdG8gYmUgY29uY2F0ZW5hdGVkIG9udG8gdGhpcyBvbmUuXG4gICAqIEBwYXJhbSBiYXNlRXJyb3JIYW5kbGVyIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgY2FuIGludGVyY2VwdCBgRXJyb3Jgc1xuICAgKiAgIHJhaXNlZCBkdXJpbmcgYSBgbmV4dCgpYCBjYWxsIG9uIHRoZSBiYXNlIHN0cmVhbS4gIFRoaXMgZnVuY3Rpb24gY2FuXG4gICAqICAgZGVjaWRlIHdoZXRoZXIgdGhlIGVycm9yIHNob3VsZCBiZSBwcm9wYWdhdGVkLCB3aGV0aGVyIHRoZSBlcnJvciBzaG91bGRcbiAgICogICBiZSBpZ25vcmVkLCBvciB3aGV0aGVyIHRoZSBiYXNlIHN0cmVhbSBzaG91bGQgYmUgdGVybWluYXRlZC5cbiAgICogQHJldHVybnMgQSBgTGF6eUl0ZXJhdG9yYC5cbiAgICovXG4gIGNvbmNhdGVuYXRlKFxuICAgICAgaXRlcmF0b3I6IExhenlJdGVyYXRvcjxUPixcbiAgICAgIGJhc2VFcnJvckhhbmRsZXI/OiAoZTogRXJyb3IpID0+IGJvb2xlYW4pOiBMYXp5SXRlcmF0b3I8VD4ge1xuICAgIHJldHVybiBuZXcgQ2hhaW5lZEl0ZXJhdG9yKFxuICAgICAgICBpdGVyYXRvckZyb21JdGVtcyhbdGhpcywgaXRlcmF0b3JdKSwgYmFzZUVycm9ySGFuZGxlcik7XG4gIH1cblxuICAvKipcbiAgICogTGltaXRzIHRoaXMgc3RyZWFtIHRvIHJldHVybiBhdCBtb3N0IGBjb3VudGAgaXRlbXMuXG4gICAqXG4gICAqIEBwYXJhbSBjb3VudCBUaGUgbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgdG8gcHJvdmlkZSBmcm9tIHRoZSBzdHJlYW0uIElmXG4gICAqIGEgbmVnYXRpdmUgb3IgdW5kZWZpbmVkIHZhbHVlIGlzIGdpdmVuLCB0aGUgZW50aXJlIHN0cmVhbSBpcyByZXR1cm5lZFxuICAgKiAgIHVuYWx0ZXJlZC5cbiAgICovXG4gIHRha2UoY291bnQ6IG51bWJlcik6IExhenlJdGVyYXRvcjxUPiB7XG4gICAgaWYgKGNvdW50IDwgMCB8fCBjb3VudCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBUYWtlSXRlcmF0b3IodGhpcywgY291bnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNraXBzIHRoZSBmaXJzdCBgY291bnRgIGl0ZW1zIGluIHRoaXMgc3RyZWFtLlxuICAgKlxuICAgKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBpdGVtcyB0byBza2lwLiAgSWYgYSBuZWdhdGl2ZSBvciB1bmRlZmluZWRcbiAgICogdmFsdWUgaXMgZ2l2ZW4sIHRoZSBlbnRpcmUgc3RyZWFtIGlzIHJldHVybmVkIHVuYWx0ZXJlZC5cbiAgICovXG4gIHNraXAoY291bnQ6IG51bWJlcik6IExhenlJdGVyYXRvcjxUPiB7XG4gICAgaWYgKGNvdW50IDwgMCB8fCBjb3VudCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTa2lwSXRlcmF0b3IodGhpcywgY291bnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZWZldGNoIHRoZSBmaXJzdCBgYnVmZmVyU2l6ZWAgaXRlbXMgaW4gdGhpcyBzdHJlYW0uXG4gICAqXG4gICAqIE5vdGUgdGhpcyBwcmVmZXRjaGVzIFByb21pc2VzLCBidXQgbWFrZXMgbm8gZ3VhcmFudGVlcyBhYm91dCB3aGVuIHRob3NlXG4gICAqIFByb21pc2VzIHJlc29sdmUuXG4gICAqXG4gICAqIEBwYXJhbSBidWZmZXJTaXplOiBBbiBpbnRlZ2VyIHNwZWNpZnlpbmcgdGhlIG51bWJlciBvZiBlbGVtZW50cyB0byBiZVxuICAgKiAgIHByZWZldGNoZWQuXG4gICAqL1xuICBwcmVmZXRjaChidWZmZXJTaXplOiBudW1iZXIpOiBMYXp5SXRlcmF0b3I8VD4ge1xuICAgIHJldHVybiBuZXcgUHJlZmV0Y2hJdGVyYXRvcih0aGlzLCBidWZmZXJTaXplKTtcbiAgfVxuXG4gIC8vIFRPRE8oc29lcmdlbCk6IGRlZXAgc2hhcmRlZCBzaHVmZmxlLCB3aGVyZSBzdXBwb3J0ZWRcblxuICAvKipcbiAgICogUmFuZG9tbHkgc2h1ZmZsZXMgdGhlIGVsZW1lbnRzIG9mIHRoaXMgc3RyZWFtLlxuICAgKlxuICAgKiBAcGFyYW0gYnVmZmVyU2l6ZTogQW4gaW50ZWdlciBzcGVjaWZ5aW5nIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgZnJvbVxuICAgKiB0aGlzIHN0cmVhbSBmcm9tIHdoaWNoIHRoZSBuZXcgc3RyZWFtIHdpbGwgc2FtcGxlLlxuICAgKiBAcGFyYW0gc2VlZDogKE9wdGlvbmFsLikgQW4gaW50ZWdlciBzcGVjaWZ5aW5nIHRoZSByYW5kb20gc2VlZCB0aGF0XG4gICAqIHdpbGwgYmUgdXNlZCB0byBjcmVhdGUgdGhlIGRpc3RyaWJ1dGlvbi5cbiAgICovXG4gIHNodWZmbGUod2luZG93U2l6ZTogbnVtYmVyLCBzZWVkPzogc3RyaW5nKTogTGF6eUl0ZXJhdG9yPFQ+IHtcbiAgICByZXR1cm4gbmV3IFNodWZmbGVJdGVyYXRvcih0aGlzLCB3aW5kb3dTaXplLCBzZWVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JjZSBhbiBpdGVyYXRvciB0byBleGVjdXRlIHNlcmlhbGx5OiBlYWNoIG5leHQoKSBjYWxsIHdpbGwgYXdhaXQgdGhlXG4gICAqIHByaW9yIG9uZSwgc28gdGhhdCB0aGV5IGNhbm5vdCBleGVjdXRlIGNvbmN1cnJlbnRseS5cbiAgICovXG4gIHNlcmlhbCgpOiBMYXp5SXRlcmF0b3I8VD4ge1xuICAgIHJldHVybiBuZXcgU2VyaWFsSXRlcmF0b3IodGhpcyk7XG4gIH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGhlIGZvbGxvd2luZyBwcml2YXRlIGNsYXNzZXMgc2VydmUgdG8gaW1wbGVtZW50IHRoZSBjaGFpbmFibGUgbWV0aG9kc1xuLy8gb24gTGF6eUl0ZXJhdG9yLiAgVW5mb3J0dW5hdGVseSB0aGV5IGNhbid0IGJlIHBsYWNlZCBpbiBzZXBhcmF0ZSBmaWxlcyxcbi8vIGR1ZSB0byByZXN1bHRpbmcgdHJvdWJsZSB3aXRoIGNpcmN1bGFyIGltcG9ydHMuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEl0ZXJhdG9ycyB0aGF0IGp1c3QgZXh0ZW5kIExhenlJdGVyYXRvciBkaXJlY3RseVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBBcnJheUl0ZXJhdG9yPFQ+IGV4dGVuZHMgTGF6eUl0ZXJhdG9yPFQ+IHtcbiAgcHJpdmF0ZSB0cmF2ID0gMDtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGl0ZW1zOiBUW10pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgc3VtbWFyeSgpIHtcbiAgICByZXR1cm4gYEFycmF5IG9mICR7dGhpcy5pdGVtcy5sZW5ndGh9IGl0ZW1zYDtcbiAgfVxuXG4gIGFzeW5jIG5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj4ge1xuICAgIGlmICh0aGlzLnRyYXYgPj0gdGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7dmFsdWU6IG51bGwsIGRvbmU6IHRydWV9O1xuICAgIH1cbiAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1t0aGlzLnRyYXZdO1xuICAgIHRoaXMudHJhdisrO1xuICAgIHJldHVybiB7dmFsdWU6IGRlZXBDbG9uZShpdGVtKSwgZG9uZTogZmFsc2V9O1xuICB9XG59XG5cbmNsYXNzIEZ1bmN0aW9uQ2FsbEl0ZXJhdG9yPFQ+IGV4dGVuZHMgTGF6eUl0ZXJhdG9yPFQ+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcm90ZWN0ZWQgbmV4dEZuOiAoKSA9PiBJdGVyYXRvclJlc3VsdDxUPnwgUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj4pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgc3VtbWFyeSgpIHtcbiAgICByZXR1cm4gYEZ1bmN0aW9uIGNhbGxgO1xuICB9XG5cbiAgYXN5bmMgbmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFQ+PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLm5leHRGbigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIE1vZGlmeSB0aGUgZXJyb3IgbWVzc2FnZSBidXQgbGVhdmUgdGhlIHN0YWNrIHRyYWNlIGludGFjdFxuICAgICAgZS5tZXNzYWdlID1cbiAgICAgICAgICBgRXJyb3IgdGhyb3duIHdoaWxlIGl0ZXJhdGluZyB0aHJvdWdoIGEgZGF0YXNldDogJHtlLm1lc3NhZ2V9YDtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFNlcmlhbEl0ZXJhdG9yPFQ+IGV4dGVuZHMgTGF6eUl0ZXJhdG9yPFQ+IHtcbiAgLy8gU3RyaWN0IFByb21pc2UgZXhlY3V0aW9uIG9yZGVyOlxuICAvLyBhIG5leHQoKSBjYWxsIG1heSBub3QgZXZlbiBiZWdpbiB1bnRpbCB0aGUgcHJldmlvdXMgb25lIGNvbXBsZXRlcy5cbiAgcHJpdmF0ZSBsYXN0UmVhZDogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj47XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHVwc3RyZWFtOiBMYXp5SXRlcmF0b3I8VD4pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubGFzdFJlYWQgPSBQcm9taXNlLnJlc29sdmUoe3ZhbHVlOiBudWxsLCBkb25lOiBmYWxzZX0pO1xuICB9XG5cbiAgc3VtbWFyeSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy51cHN0cmVhbS5zdW1tYXJ5KCl9IC0+IFNlcmlhbGA7XG4gIH1cblxuICBhc3luYyBuZXh0KCk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+IHtcbiAgICAvLyBUaGlzIHNldHMgdGhpcy5sYXN0UmVhZCB0byBhIG5ldyBQcm9taXNlIHJpZ2h0IGF3YXksIGFzIG9wcG9zZWQgdG9cbiAgICAvLyBzYXlpbmcgYGF3YWl0IHRoaXMubGFzdFJlYWQ7IHRoaXMubGFzdFJlYWQgPSB0aGlzLnNlcmlhbE5leHQoKTtgIHdoaWNoXG4gICAgLy8gd291bGQgbm90IHdvcmsgYmVjYXVzZSB0aGlzLm5leHRSZWFkIHdvdWxkIGJlIHVwZGF0ZWQgb25seSBhZnRlciB0aGVcbiAgICAvLyBwcm9taXNlIHJlc29sdmVzLlxuICAgIHRoaXMubGFzdFJlYWQgPSB0aGlzLmxhc3RSZWFkLnRoZW4oKCkgPT4gdGhpcy5zZXJpYWxOZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLmxhc3RSZWFkO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZXJpYWxOZXh0KCk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+IHtcbiAgICByZXR1cm4gdGhpcy51cHN0cmVhbS5uZXh0KCk7XG4gIH1cbn1cblxuY2xhc3MgU2tpcEl0ZXJhdG9yPFQ+IGV4dGVuZHMgTGF6eUl0ZXJhdG9yPFQ+IHtcbiAgLy8gU3RyaWN0IFByb21pc2UgZXhlY3V0aW9uIG9yZGVyOlxuICAvLyBhIG5leHQoKSBjYWxsIG1heSBub3QgZXZlbiBiZWdpbiB1bnRpbCB0aGUgcHJldmlvdXMgb25lIGNvbXBsZXRlcy5cbiAgcHJpdmF0ZSBsYXN0UmVhZDogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj47XG5cbiAgLy8gTG9jYWwgc3RhdGUgdGhhdCBzaG91bGQgbm90IGJlIGNsb2JiZXJlZCBieSBvdXQtb2Ytb3JkZXIgZXhlY3V0aW9uLlxuICBjb3VudCA9IDA7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHVwc3RyZWFtOiBMYXp5SXRlcmF0b3I8VD4sIHByb3RlY3RlZCBtYXhDb3VudDogbnVtYmVyKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmxhc3RSZWFkID0gUHJvbWlzZS5yZXNvbHZlKHt2YWx1ZTogbnVsbCwgZG9uZTogZmFsc2V9KTtcbiAgfVxuXG4gIHN1bW1hcnkoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMudXBzdHJlYW0uc3VtbWFyeSgpfSAtPiBTa2lwYDtcbiAgfVxuXG4gIGFzeW5jIG5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj4ge1xuICAgIC8vIFRoaXMgc2V0cyB0aGlzLmxhc3RSZWFkIHRvIGEgbmV3IFByb21pc2UgcmlnaHQgYXdheSwgYXMgb3Bwb3NlZCB0b1xuICAgIC8vIHNheWluZyBgYXdhaXQgdGhpcy5sYXN0UmVhZDsgdGhpcy5sYXN0UmVhZCA9IHRoaXMuc2VyaWFsTmV4dCgpO2Agd2hpY2hcbiAgICAvLyB3b3VsZCBub3Qgd29yayBiZWNhdXNlIHRoaXMubmV4dFJlYWQgd291bGQgYmUgdXBkYXRlZCBvbmx5IGFmdGVyIHRoZVxuICAgIC8vIHByb21pc2UgcmVzb2x2ZXMuXG4gICAgdGhpcy5sYXN0UmVhZCA9IHRoaXMubGFzdFJlYWQudGhlbigoKSA9PiB0aGlzLnNlcmlhbE5leHQoKSk7XG4gICAgcmV0dXJuIHRoaXMubGFzdFJlYWQ7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNlcmlhbE5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj4ge1xuICAgIC8vIFRPRE8oc29lcmdlbCk6IGNvbnNpZGVyIHRyYWRlb2ZmcyBvZiByZWFkaW5nIGluIHBhcmFsbGVsLCBlZy5cbiAgICAvLyBjb2xsZWN0aW5nIG5leHQoKSBwcm9taXNlcyBpbiBhbiBBcnJheSBhbmQgdGhlbiB3YWl0aW5nIGZvclxuICAgIC8vIFByb21pc2UuYWxsKCkgb2YgdGhvc2UuIEJlbmVmaXQ6IHBzZXVkby1wYXJhbGxlbCBleGVjdXRpb24uICBEcmF3YmFjazpcbiAgICAvLyBtYXliZSBkZWxheWVkIEdDLlxuICAgIHdoaWxlICh0aGlzLmNvdW50KysgPCB0aGlzLm1heENvdW50KSB7XG4gICAgICBjb25zdCBza2lwcGVkID0gYXdhaXQgdGhpcy51cHN0cmVhbS5uZXh0KCk7XG4gICAgICAvLyBzaG9ydC1jaXJjdWl0IGlmIHVwc3RyZWFtIGlzIGFscmVhZHkgZW1wdHlcbiAgICAgIGlmIChza2lwcGVkLmRvbmUpIHtcbiAgICAgICAgcmV0dXJuIHNraXBwZWQ7XG4gICAgICB9XG4gICAgICB0Zi5kaXNwb3NlKHNraXBwZWQudmFsdWUgYXMge30pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy51cHN0cmVhbS5uZXh0KCk7XG4gIH1cbn1cblxuY2xhc3MgVGFrZUl0ZXJhdG9yPFQ+IGV4dGVuZHMgTGF6eUl0ZXJhdG9yPFQ+IHtcbiAgY291bnQgPSAwO1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdXBzdHJlYW06IExhenlJdGVyYXRvcjxUPiwgcHJvdGVjdGVkIG1heENvdW50OiBudW1iZXIpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgc3VtbWFyeSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy51cHN0cmVhbS5zdW1tYXJ5KCl9IC0+IFRha2VgO1xuICB9XG5cbiAgYXN5bmMgbmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFQ+PiB7XG4gICAgaWYgKHRoaXMuY291bnQrKyA+PSB0aGlzLm1heENvdW50KSB7XG4gICAgICByZXR1cm4ge3ZhbHVlOiBudWxsLCBkb25lOiB0cnVlfTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudXBzdHJlYW0ubmV4dCgpO1xuICB9XG59XG5cbi8vIE5vdGUgdGhpcyBiYXRjaCBqdXN0IGdyb3VwcyBpdGVtcyBpbnRvIHJvdy13aXNlIGVsZW1lbnQgYXJyYXlzLlxuLy8gUm90YXRpbmcgdGhlc2UgdG8gYSBjb2x1bW4td2lzZSByZXByZXNlbnRhdGlvbiBoYXBwZW5zIG9ubHkgYXQgdGhlIGRhdGFzZXRcbi8vIGxldmVsLlxuY2xhc3MgUm93TWFqb3JCYXRjaEl0ZXJhdG9yPFQ+IGV4dGVuZHMgTGF6eUl0ZXJhdG9yPFRbXT4ge1xuICAvLyBTdHJpY3QgUHJvbWlzZSBleGVjdXRpb24gb3JkZXI6XG4gIC8vIGEgbmV4dCgpIGNhbGwgbWF5IG5vdCBldmVuIGJlZ2luIHVudGlsIHRoZSBwcmV2aW91cyBvbmUgY29tcGxldGVzLlxuICBwcml2YXRlIGxhc3RSZWFkOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFRbXT4+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJvdGVjdGVkIHVwc3RyZWFtOiBMYXp5SXRlcmF0b3I8VD4sIHByb3RlY3RlZCBiYXRjaFNpemU6IG51bWJlcixcbiAgICAgIHByb3RlY3RlZCBlbmFibGVTbWFsbExhc3RCYXRjaCA9IHRydWUpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubGFzdFJlYWQgPSBQcm9taXNlLnJlc29sdmUoe3ZhbHVlOiBudWxsLCBkb25lOiBmYWxzZX0pO1xuICB9XG5cbiAgc3VtbWFyeSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy51cHN0cmVhbS5zdW1tYXJ5KCl9IC0+IFJvd01ham9yQmF0Y2hgO1xuICB9XG5cbiAgYXN5bmMgbmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFRbXT4+IHtcbiAgICAvLyBUaGlzIHNldHMgdGhpcy5sYXN0UmVhZCB0byBhIG5ldyBQcm9taXNlIHJpZ2h0IGF3YXksIGFzIG9wcG9zZWQgdG9cbiAgICAvLyBzYXlpbmcgYGF3YWl0IHRoaXMubGFzdFJlYWQ7IHRoaXMubGFzdFJlYWQgPSB0aGlzLnNlcmlhbE5leHQoKTtgIHdoaWNoXG4gICAgLy8gd291bGQgbm90IHdvcmsgYmVjYXVzZSB0aGlzLm5leHRSZWFkIHdvdWxkIGJlIHVwZGF0ZWQgb25seSBhZnRlciB0aGVcbiAgICAvLyBwcm9taXNlIHJlc29sdmVzLlxuICAgIHRoaXMubGFzdFJlYWQgPSB0aGlzLmxhc3RSZWFkLnRoZW4oKCkgPT4gdGhpcy5zZXJpYWxOZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLmxhc3RSZWFkO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZXJpYWxOZXh0KCk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VFtdPj4ge1xuICAgIGNvbnN0IGJhdGNoOiBUW10gPSBbXTtcbiAgICB3aGlsZSAoYmF0Y2gubGVuZ3RoIDwgdGhpcy5iYXRjaFNpemUpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCB0aGlzLnVwc3RyZWFtLm5leHQoKTtcbiAgICAgIGlmIChpdGVtLmRvbmUpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlU21hbGxMYXN0QmF0Y2ggJiYgYmF0Y2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiB7dmFsdWU6IGJhdGNoLCBkb25lOiBmYWxzZX07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt2YWx1ZTogbnVsbCwgZG9uZTogdHJ1ZX07XG4gICAgICB9XG4gICAgICBiYXRjaC5wdXNoKGl0ZW0udmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4ge3ZhbHVlOiBiYXRjaCwgZG9uZTogZmFsc2V9O1xuICB9XG59XG5cbmNsYXNzIEZpbHRlckl0ZXJhdG9yPFQ+IGV4dGVuZHMgTGF6eUl0ZXJhdG9yPFQ+IHtcbiAgLy8gU3RyaWN0IFByb21pc2UgZXhlY3V0aW9uIG9yZGVyOlxuICAvLyBhIG5leHQoKSBjYWxsIG1heSBub3QgZXZlbiBiZWdpbiB1bnRpbCB0aGUgcHJldmlvdXMgb25lIGNvbXBsZXRlcy5cbiAgcHJpdmF0ZSBsYXN0UmVhZDogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcm90ZWN0ZWQgdXBzdHJlYW06IExhenlJdGVyYXRvcjxUPixcbiAgICAgIHByb3RlY3RlZCBwcmVkaWNhdGU6ICh2YWx1ZTogVCkgPT4gYm9vbGVhbikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5sYXN0UmVhZCA9IFByb21pc2UucmVzb2x2ZSh7dmFsdWU6IG51bGwsIGRvbmU6IGZhbHNlfSk7XG4gIH1cblxuICBzdW1tYXJ5KCkge1xuICAgIHJldHVybiBgJHt0aGlzLnVwc3RyZWFtLnN1bW1hcnkoKX0gLT4gRmlsdGVyYDtcbiAgfVxuXG4gIGFzeW5jIG5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj4ge1xuICAgIC8vIFRoaXMgc2V0cyB0aGlzLmxhc3RSZWFkIHRvIGEgbmV3IFByb21pc2UgcmlnaHQgYXdheSwgYXMgb3Bwb3NlZCB0b1xuICAgIC8vIHNheWluZyBgYXdhaXQgdGhpcy5sYXN0UmVhZDsgdGhpcy5sYXN0UmVhZCA9IHRoaXMuc2VyaWFsTmV4dCgpO2Agd2hpY2hcbiAgICAvLyB3b3VsZCBub3Qgd29yayBiZWNhdXNlIHRoaXMubmV4dFJlYWQgd291bGQgYmUgdXBkYXRlZCBvbmx5IGFmdGVyIHRoZVxuICAgIC8vIHByb21pc2UgcmVzb2x2ZXMuXG4gICAgdGhpcy5sYXN0UmVhZCA9IHRoaXMubGFzdFJlYWQudGhlbigoKSA9PiB0aGlzLnNlcmlhbE5leHQoKSk7XG4gICAgcmV0dXJuIHRoaXMubGFzdFJlYWQ7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNlcmlhbE5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj4ge1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBpdGVtID0gYXdhaXQgdGhpcy51cHN0cmVhbS5uZXh0KCk7XG4gICAgICBpZiAoaXRlbS5kb25lIHx8IHRoaXMucHJlZGljYXRlKGl0ZW0udmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfVxuICAgICAgdGYuZGlzcG9zZShpdGVtLnZhbHVlIGFzIHt9KTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgTWFwSXRlcmF0b3I8SSwgTz4gZXh0ZW5kcyBMYXp5SXRlcmF0b3I8Tz4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByb3RlY3RlZCB1cHN0cmVhbTogTGF6eUl0ZXJhdG9yPEk+LFxuICAgICAgcHJvdGVjdGVkIHRyYW5zZm9ybTogKHZhbHVlOiBJKSA9PiBPKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHN1bW1hcnkoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMudXBzdHJlYW0uc3VtbWFyeSgpfSAtPiBNYXBgO1xuICB9XG5cbiAgYXN5bmMgbmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PE8+PiB7XG4gICAgY29uc3QgaXRlbSA9IGF3YWl0IHRoaXMudXBzdHJlYW0ubmV4dCgpO1xuICAgIGlmIChpdGVtLmRvbmUpIHtcbiAgICAgIHJldHVybiB7dmFsdWU6IG51bGwsIGRvbmU6IHRydWV9O1xuICAgIH1cbiAgICBjb25zdCBpbnB1dFRlbnNvcnMgPSB0Zi50ZW5zb3JfdXRpbC5nZXRUZW5zb3JzSW5Db250YWluZXIoaXRlbS52YWx1ZSBhcyB7fSk7XG4gICAgLy8gQ2FyZWZ1bDogdGhlIHRyYW5zZm9ybSBtYXkgbXV0YXRlIHRoZSBpdGVtIGluIHBsYWNlLlxuICAgIC8vIFRoYXQncyB3aHkgd2UgaGF2ZSB0byByZW1lbWJlciB0aGUgaW5wdXQgVGVuc29ycyBhYm92ZSwgYW5kIHRoZW5cbiAgICAvLyBiZWxvdyBkaXNwb3NlIG9ubHkgdGhvc2UgdGhhdCB3ZXJlIG5vdCBwYXNzZWQgdGhyb3VnaCB0byB0aGUgb3V0cHV0LlxuICAgIC8vIE5vdGUgdG9vIHRoYXQgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiBpcyByZXNwb25zaWJsZSBmb3IgdGlkeWluZ1xuICAgIC8vIGFueSBpbnRlcm1lZGlhdGUgVGVuc29ycy4gIEhlcmUgd2UgYXJlIGNvbmNlcm5lZCBvbmx5IGFib3V0IHRoZVxuICAgIC8vIGlucHV0cy5cbiAgICBjb25zdCBtYXBwZWQgPSB0aGlzLnRyYW5zZm9ybShpdGVtLnZhbHVlKTtcbiAgICBjb25zdCBvdXRwdXRUZW5zb3JzID0gdGYudGVuc29yX3V0aWwuZ2V0VGVuc29yc0luQ29udGFpbmVyKG1hcHBlZCBhcyB7fSk7XG5cbiAgICAvLyBUT0RPKHNvZXJnZWwpIGZhc3RlciBpbnRlcnNlY3Rpb25cbiAgICAvLyBUT0RPKHNvZXJnZWwpIG1vdmUgdG8gdGYuZGlzcG9zZUV4Y2VwdChpbiwgb3V0KT9cbiAgICBmb3IgKGNvbnN0IHQgb2YgaW5wdXRUZW5zb3JzKSB7XG4gICAgICBpZiAoIXRmLnRlbnNvcl91dGlsLmlzVGVuc29ySW5MaXN0KHQsIG91dHB1dFRlbnNvcnMpKSB7XG4gICAgICAgIHQuZGlzcG9zZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge3ZhbHVlOiBtYXBwZWQsIGRvbmU6IGZhbHNlfTtcbiAgfVxufVxuXG5jbGFzcyBFcnJvckhhbmRsaW5nTGF6eUl0ZXJhdG9yPFQ+IGV4dGVuZHMgTGF6eUl0ZXJhdG9yPFQ+IHtcbiAgY291bnQgPSAwO1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByb3RlY3RlZCB1cHN0cmVhbTogTGF6eUl0ZXJhdG9yPFQ+LFxuICAgICAgcHJvdGVjdGVkIGhhbmRsZXI6IChlcnJvcjogRXJyb3IpID0+IGJvb2xlYW4pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubGFzdFJlYWQgPSBQcm9taXNlLnJlc29sdmUoe3ZhbHVlOiBudWxsLCBkb25lOiBmYWxzZX0pO1xuICB9XG5cbiAgc3VtbWFyeSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy51cHN0cmVhbS5zdW1tYXJ5KCl9IC0+IGhhbmRsZUVycm9yc2A7XG4gIH1cblxuICAvLyBTdHJpY3QgUHJvbWlzZSBleGVjdXRpb24gb3JkZXI6XG4gIC8vIGEgbmV4dCgpIGNhbGwgbWF5IG5vdCBldmVuIGJlZ2luIHVudGlsIHRoZSBwcmV2aW91cyBvbmUgY29tcGxldGVzLlxuICBwcml2YXRlIGxhc3RSZWFkOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFQ+PjtcblxuICBhc3luYyBuZXh0KCk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+IHtcbiAgICAvLyBUaGlzIHNldHMgdGhpcy5sYXN0UmVhZCB0byBhIG5ldyBQcm9taXNlIHJpZ2h0IGF3YXksIGFzIG9wcG9zZWQgdG9cbiAgICAvLyBzYXlpbmcgYGF3YWl0IHRoaXMubGFzdFJlYWQ7IHRoaXMubGFzdFJlYWQgPSB0aGlzLnNlcmlhbE5leHQoKTtgIHdoaWNoXG4gICAgLy8gd291bGQgbm90IHdvcmsgYmVjYXVzZSB0aGlzLm5leHRSZWFkIHdvdWxkIGJlIHVwZGF0ZWQgb25seSBhZnRlciB0aGVcbiAgICAvLyBwcm9taXNlIHJlc29sdmVzLlxuICAgIHRoaXMubGFzdFJlYWQgPSB0aGlzLmxhc3RSZWFkLnRoZW4oKCkgPT4gdGhpcy5zZXJpYWxOZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLmxhc3RSZWFkO1xuICB9XG5cbiAgYXN5bmMgc2VyaWFsTmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFQ+PiB7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnVwc3RyZWFtLm5leHQoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhbmRsZXIoZSkpIHtcbiAgICAgICAgICByZXR1cm4ge3ZhbHVlOiBudWxsLCBkb25lOiB0cnVlfTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGUgaGFuZGxlciByZXR1cm5zIHRydWUsIGxvb3AgYW5kIGZldGNoIHRoZSBuZXh0IHVwc3RyZWFtIGl0ZW0uXG5cbiAgICAgICAgLy8gSWYgdGhlIHVwc3RyZWFtIGl0ZXJhdG9yIHRocm93cyBhbiBlbmRsZXNzIHN0cmVhbSBvZiBlcnJvcnMsIGFuZCBpZlxuICAgICAgICAvLyB0aGUgaGFuZGxlciBzYXlzIHRvIGlnbm9yZSB0aGVtLCB0aGVuIHdlIGxvb3AgZm9yZXZlciBoZXJlLiAgVGhhdCBpc1xuICAgICAgICAvLyB0aGUgY29ycmVjdCBiZWhhdmlvci0tIGl0J3MgdXAgdG8gdGhlIGhhbmRsZXIgdG8gZGVjaWRlIHdoZW4gdG8gc3RvcC5cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgQXN5bmNNYXBJdGVyYXRvcjxJLCBPPiBleHRlbmRzIExhenlJdGVyYXRvcjxPPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJvdGVjdGVkIHVwc3RyZWFtOiBMYXp5SXRlcmF0b3I8ST4sXG4gICAgICBwcm90ZWN0ZWQgdHJhbnNmb3JtOiAodmFsdWU6IEkpID0+IFByb21pc2U8Tz4pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgc3VtbWFyeSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy51cHN0cmVhbS5zdW1tYXJ5KCl9IC0+IEFzeW5jTWFwYDtcbiAgfVxuXG4gIGFzeW5jIG5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxPPj4ge1xuICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCB0aGlzLnVwc3RyZWFtLm5leHQoKTtcbiAgICBpZiAoaXRlbS5kb25lKSB7XG4gICAgICByZXR1cm4ge3ZhbHVlOiBudWxsLCBkb25lOiB0cnVlfTtcbiAgICB9XG4gICAgY29uc3QgaW5wdXRUZW5zb3JzID0gdGYudGVuc29yX3V0aWwuZ2V0VGVuc29yc0luQ29udGFpbmVyKGl0ZW0udmFsdWUgYXMge30pO1xuICAgIC8vIENhcmVmdWw6IHRoZSB0cmFuc2Zvcm0gbWF5IG11dGF0ZSB0aGUgaXRlbSBpbiBwbGFjZS5cbiAgICAvLyBUaGF0J3Mgd2h5IHdlIGhhdmUgdG8gcmVtZW1iZXIgdGhlIGlucHV0IFRlbnNvcnMgYWJvdmUsIGFuZCB0aGVuXG4gICAgLy8gYmVsb3cgZGlzcG9zZSBvbmx5IHRob3NlIHRoYXQgd2VyZSBub3QgcGFzc2VkIHRocm91Z2ggdG8gdGhlIG91dHB1dC5cbiAgICAvLyBOb3RlIHRvbyB0aGF0IHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gaXMgcmVzcG9uc2libGUgZm9yIHRpZHlpbmdcbiAgICAvLyBhbnkgaW50ZXJtZWRpYXRlIFRlbnNvcnMuICBIZXJlIHdlIGFyZSBjb25jZXJuZWQgb25seSBhYm91dCB0aGVcbiAgICAvLyBpbnB1dHMuXG4gICAgY29uc3QgbWFwcGVkID0gYXdhaXQgdGhpcy50cmFuc2Zvcm0oaXRlbS52YWx1ZSk7XG4gICAgY29uc3Qgb3V0cHV0VGVuc29ycyA9IHRmLnRlbnNvcl91dGlsLmdldFRlbnNvcnNJbkNvbnRhaW5lcihtYXBwZWQgYXMge30pO1xuXG4gICAgLy8gVE9ETyhzb2VyZ2VsKSBmYXN0ZXIgaW50ZXJzZWN0aW9uXG4gICAgLy8gVE9ETyhzb2VyZ2VsKSBtb3ZlIHRvIHRmLmRpc3Bvc2VFeGNlcHQoaW4sIG91dCk/XG4gICAgZm9yIChjb25zdCB0IG9mIGlucHV0VGVuc29ycykge1xuICAgICAgaWYgKCF0Zi50ZW5zb3JfdXRpbC5pc1RlbnNvckluTGlzdCh0LCBvdXRwdXRUZW5zb3JzKSkge1xuICAgICAgICB0LmRpc3Bvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHt2YWx1ZTogbWFwcGVkLCBkb25lOiBmYWxzZX07XG4gIH1cbn1cblxuLy8gSXRlcmF0b3JzIHRoYXQgbWFpbnRhaW4gYSBxdWV1ZSBvZiBwZW5kaW5nIGl0ZW1zXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogQSBiYXNlIGNsYXNzIGZvciB0cmFuc2Zvcm1pbmcgc3RyZWFtcyB0aGF0IG9wZXJhdGUgYnkgbWFpbnRhaW5pbmcgYW5cbiAqIG91dHB1dCBxdWV1ZSBvZiBlbGVtZW50cyB0aGF0IGFyZSByZWFkeSB0byByZXR1cm4gdmlhIG5leHQoKS4gIFRoaXMgaXNcbiAqIGNvbW1vbmx5IHJlcXVpcmVkIHdoZW4gdGhlIHRyYW5zZm9ybWF0aW9uIGlzIDEtdG8tbWFueTogIEEgY2FsbCB0byBuZXh0KClcbiAqIG1heSB0cmlnZ2VyIGEgY2FsbCB0byB0aGUgdW5kZXJseWluZyBzdHJlYW0sIHdoaWNoIHdpbGwgcHJvZHVjZSBtYW55XG4gKiBtYXBwZWQgZWxlbWVudHMgb2YgdGhpcyBzdHJlYW0tLSBvZiB3aGljaCB3ZSBuZWVkIHRvIHJldHVybiBvbmx5IG9uZSwgc29cbiAqIHdlIGhhdmUgdG8gcXVldWUgdGhlIHJlc3QuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBPbmVUb01hbnlJdGVyYXRvcjxUPiBleHRlbmRzIExhenlJdGVyYXRvcjxUPiB7XG4gIC8vIFN0cmljdCBQcm9taXNlIGV4ZWN1dGlvbiBvcmRlcjpcbiAgLy8gYSBuZXh0KCkgY2FsbCBtYXkgbm90IGV2ZW4gYmVnaW4gdW50aWwgdGhlIHByZXZpb3VzIG9uZSBjb21wbGV0ZXMuXG4gIHByaXZhdGUgbGFzdFJlYWQ6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+O1xuXG4gIC8vIExvY2FsIHN0YXRlIHRoYXQgc2hvdWxkIG5vdCBiZSBjbG9iYmVyZWQgYnkgb3V0LW9mLW9yZGVyIGV4ZWN1dGlvbi5cbiAgcHJvdGVjdGVkIG91dHB1dFF1ZXVlOiBSaW5nQnVmZmVyPFQ+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5vdXRwdXRRdWV1ZSA9IG5ldyBHcm93aW5nUmluZ0J1ZmZlcjxUPigpO1xuICAgIHRoaXMubGFzdFJlYWQgPSBQcm9taXNlLnJlc29sdmUoe3ZhbHVlOiBudWxsLCBkb25lOiBmYWxzZX0pO1xuICB9XG5cbiAgYXN5bmMgbmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFQ+PiB7XG4gICAgLy8gVGhpcyBzZXRzIHRoaXMubGFzdFJlYWQgdG8gYSBuZXcgUHJvbWlzZSByaWdodCBhd2F5LCBhcyBvcHBvc2VkIHRvXG4gICAgLy8gc2F5aW5nIGBhd2FpdCB0aGlzLmxhc3RSZWFkOyB0aGlzLmxhc3RSZWFkID0gdGhpcy5zZXJpYWxOZXh0KCk7YCB3aGljaFxuICAgIC8vIHdvdWxkIG5vdCB3b3JrIGJlY2F1c2UgdGhpcy5uZXh0UmVhZCB3b3VsZCBiZSB1cGRhdGVkIG9ubHkgYWZ0ZXIgdGhlXG4gICAgLy8gcHJvbWlzZSByZXNvbHZlcy5cbiAgICB0aGlzLmxhc3RSZWFkID0gdGhpcy5sYXN0UmVhZC50aGVuKCgpID0+IHRoaXMuc2VyaWFsTmV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy5sYXN0UmVhZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIG9uZSBvciBtb3JlIGNodW5rcyBmcm9tIHVwc3RyZWFtIGFuZCBwcm9jZXNzIHRoZW0sIHBvc3NpYmx5XG4gICAqIHJlYWRpbmcgb3Igd3JpdGluZyBhIGNhcnJ5b3ZlciwgYW5kIGFkZGluZyBwcm9jZXNzZWQgaXRlbXMgdG8gdGhlXG4gICAqIG91dHB1dCBxdWV1ZS4gIE5vdGUgaXQncyBwb3NzaWJsZSB0aGF0IG5vIGl0ZW1zIGFyZSBhZGRlZCB0byB0aGUgcXVldWVcbiAgICogb24gYSBnaXZlbiBwdW1wKCkgY2FsbCwgZXZlbiBpZiB0aGUgdXBzdHJlYW0gc3RyZWFtIGlzIG5vdCBjbG9zZWRcbiAgICogKGUuZy4sIGJlY2F1c2UgaXRlbXMgYXJlIGZpbHRlcmVkKS5cbiAgICpcbiAgICogQHJldHVybiBgdHJ1ZWAgaWYgYW55IGFjdGlvbiB3YXMgdGFrZW4sIGkuZS4gZmV0Y2hpbmcgaXRlbXMgZnJvbSB0aGVcbiAgICogICB1cHN0cmVhbSBzb3VyY2UgT1IgYWRkaW5nIGl0ZW1zIHRvIHRoZSBvdXRwdXQgcXVldWUuICBgZmFsc2VgIGlmIHRoZVxuICAgKiAgIHVwc3RyZWFtIHNvdXJjZSBpcyBleGhhdXN0ZWQgQU5EIG5vdGhpbmcgd2FzIGFkZGVkIHRvIHRoZSBxdWV1ZVxuICAgKiAoaS5lLiwgYW55IHJlbWFpbmluZyBjYXJyeW92ZXIpLlxuICAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIHB1bXAoKTogUHJvbWlzZTxib29sZWFuPjtcblxuICBhc3luYyBzZXJpYWxOZXh0KCk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+IHtcbiAgICAvLyBGZXRjaCBzbyB0aGF0IHRoZSBxdWV1ZSBjb250YWlucyBhdCBsZWFzdCBvbmUgaXRlbSBpZiBwb3NzaWJsZS5cbiAgICAvLyBJZiB0aGUgdXBzdHJlYW0gc291cmNlIGlzIGV4aGF1c3RlZCwgQU5EIHRoZXJlIGFyZSBubyBpdGVtcyBsZWZ0IGluXG4gICAgLy8gdGhlIG91dHB1dCBxdWV1ZSwgdGhlbiB0aGlzIHN0cmVhbSBpcyBhbHNvIGV4aGF1c3RlZC5cbiAgICB3aGlsZSAodGhpcy5vdXRwdXRRdWV1ZS5sZW5ndGgoKSA9PT0gMCkge1xuICAgICAgLy8gVE9ETyhzb2VyZ2VsKTogY29uc2lkZXIgcGFyYWxsZWwgcmVhZHMuXG4gICAgICBpZiAoIWF3YWl0IHRoaXMucHVtcCgpKSB7XG4gICAgICAgIHJldHVybiB7dmFsdWU6IG51bGwsIGRvbmU6IHRydWV9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge3ZhbHVlOiB0aGlzLm91dHB1dFF1ZXVlLnNoaWZ0KCksIGRvbmU6IGZhbHNlfTtcbiAgfVxufVxuY2xhc3MgRmxhdG1hcEl0ZXJhdG9yPEksIE8+IGV4dGVuZHMgT25lVG9NYW55SXRlcmF0b3I8Tz4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByb3RlY3RlZCB1cHN0cmVhbTogTGF6eUl0ZXJhdG9yPEk+LFxuICAgICAgcHJvdGVjdGVkIHRyYW5zZm9ybTogKHZhbHVlOiBJKSA9PiBPW10pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgc3VtbWFyeSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy51cHN0cmVhbS5zdW1tYXJ5KCl9IC0+IEZsYXRtYXBgO1xuICB9XG5cbiAgYXN5bmMgcHVtcCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBpdGVtID0gYXdhaXQgdGhpcy51cHN0cmVhbS5uZXh0KCk7XG4gICAgaWYgKGl0ZW0uZG9uZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dFRlbnNvcnMgPSB0Zi50ZW5zb3JfdXRpbC5nZXRUZW5zb3JzSW5Db250YWluZXIoaXRlbS52YWx1ZSBhcyB7fSk7XG4gICAgLy8gQ2FyZWZ1bDogdGhlIHRyYW5zZm9ybSBtYXkgbXV0YXRlIHRoZSBpdGVtIGluIHBsYWNlLlxuICAgIC8vIHRoYXQncyB3aHkgd2UgaGF2ZSB0byByZW1lbWJlciB0aGUgaW5wdXQgVGVuc29ycyBhYm92ZSwgYW5kIHRoZW5cbiAgICAvLyBiZWxvdyBkaXNwb3NlIG9ubHkgdGhvc2UgdGhhdCB3ZXJlIG5vdCBwYXNzZWQgdGhyb3VnaCB0byB0aGUgb3V0cHV0LlxuICAgIC8vIE5vdGUgdG9vIHRoYXQgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiBpcyByZXNwb25zaWJsZSBmb3IgdGlkeWluZyBhbnlcbiAgICAvLyBpbnRlcm1lZGlhdGUgVGVuc29ycy4gIEhlcmUgd2UgYXJlIGNvbmNlcm5lZCBvbmx5IGFib3V0IHRoZSBpbnB1dHMuXG4gICAgY29uc3QgbWFwcGVkQXJyYXkgPSB0aGlzLnRyYW5zZm9ybShpdGVtLnZhbHVlKTtcbiAgICBjb25zdCBvdXRwdXRUZW5zb3JzID1cbiAgICAgICAgdGYudGVuc29yX3V0aWwuZ2V0VGVuc29yc0luQ29udGFpbmVyKG1hcHBlZEFycmF5IGFzIHt9KTtcbiAgICB0aGlzLm91dHB1dFF1ZXVlLnB1c2hBbGwobWFwcGVkQXJyYXkpO1xuXG4gICAgLy8gVE9ETyhzb2VyZ2VsKSBmYXN0ZXIgaW50ZXJzZWN0aW9uLCBhbmQgZGVkdXBsaWNhdGUgb3V0cHV0VGVuc29yc1xuICAgIC8vIFRPRE8oc29lcmdlbCkgbW92ZSB0byB0Zi5kaXNwb3NlRXhjZXB0KGluLCBvdXQpP1xuICAgIGZvciAoY29uc3QgdCBvZiBpbnB1dFRlbnNvcnMpIHtcbiAgICAgIGlmICghdGYudGVuc29yX3V0aWwuaXNUZW5zb3JJbkxpc3QodCwgb3V0cHV0VGVuc29ycykpIHtcbiAgICAgICAgdC5kaXNwb3NlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm92aWRlcyBhIGBMYXp5SXRlcmF0b3JgIHRoYXQgY29uY2F0ZW5hdGVzIGEgc3RyZWFtIG9mIHVuZGVybHlpbmdcbiAqIHN0cmVhbXMuXG4gKlxuICogRG9pbmcgdGhpcyBpbiBhIGNvbmN1cnJlbmN5LXNhZmUgd2F5IHJlcXVpcmVzIHNvbWUgdHJpY2tlcnkuICBJblxuICogcGFydGljdWxhciwgd2Ugd2FudCB0aGlzIHN0cmVhbSB0byByZXR1cm4gdGhlIGVsZW1lbnRzIGZyb20gdGhlXG4gKiB1bmRlcmx5aW5nIHN0cmVhbXMgaW4gdGhlIGNvcnJlY3Qgb3JkZXIgYWNjb3JkaW5nIHRvIHdoZW4gbmV4dCgpIHdhc1xuICogY2FsbGVkLCBldmVuIGlmIHRoZSByZXN1bHRpbmcgUHJvbWlzZXMgcmVzb2x2ZSBpbiBhIGRpZmZlcmVudCBvcmRlci5cbiAqL1xuZXhwb3J0IGNsYXNzIENoYWluZWRJdGVyYXRvcjxUPiBleHRlbmRzIExhenlJdGVyYXRvcjxUPiB7XG4gIC8vIFN0cmljdCBQcm9taXNlIGV4ZWN1dGlvbiBvcmRlcjpcbiAgLy8gYSBuZXh0KCkgY2FsbCBtYXkgbm90IGV2ZW4gYmVnaW4gdW50aWwgdGhlIHByZXZpb3VzIG9uZSBjb21wbGV0ZXMuXG4gIHByaXZhdGUgbGFzdFJlYWQ6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+ID0gbnVsbDtcblxuICAvLyBMb2NhbCBzdGF0ZSB0aGF0IHNob3VsZCBub3QgYmUgY2xvYmJlcmVkIGJ5IG91dC1vZi1vcmRlciBleGVjdXRpb24uXG4gIHByaXZhdGUgaXRlcmF0b3I6IExhenlJdGVyYXRvcjxUPiA9IG51bGw7XG4gIHByaXZhdGUgbW9yZUl0ZXJhdG9yczogTGF6eUl0ZXJhdG9yPExhenlJdGVyYXRvcjxUPj47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBpdGVyYXRvcnM6IExhenlJdGVyYXRvcjxMYXp5SXRlcmF0b3I8VD4+LFxuICAgICAgcHJpdmF0ZSByZWFkb25seSBiYXNlRXJyb3JIYW5kbGVyPzogKGU6IEVycm9yKSA9PiBib29sZWFuKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm1vcmVJdGVyYXRvcnMgPSBpdGVyYXRvcnM7XG4gIH1cblxuICBzdW1tYXJ5KCkge1xuICAgIGNvbnN0IHVwc3RyZWFtU3VtbWFyaWVzID0gJ1RPRE86IGZpbGwgaW4gdXBzdHJlYW0gb2YgY2hhaW5lZCBzdW1tYXJpZXMnO1xuICAgIHJldHVybiBgJHt1cHN0cmVhbVN1bW1hcmllc30gLT4gQ2hhaW5lZGA7XG4gIH1cblxuICBhc3luYyBuZXh0KCk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+IHtcbiAgICB0aGlzLmxhc3RSZWFkID0gdGhpcy5yZWFkRnJvbUNoYWluKHRoaXMubGFzdFJlYWQpO1xuICAgIHJldHVybiB0aGlzLmxhc3RSZWFkO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyByZWFkRnJvbUNoYWluKGxhc3RSZWFkOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFQ+Pik6XG4gICAgICBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFQ+PiB7XG4gICAgLy8gTXVzdCBhd2FpdCBvbiB0aGUgcHJldmlvdXMgcmVhZCBzaW5jZSB0aGUgcHJldmlvdXMgcmVhZCBtYXkgaGF2ZSBhZHZhbmNlZFxuICAgIC8vIHRoZSBzdHJlYW0gb2Ygc3RyZWFtcywgZnJvbSB3aGljaCB3ZSBuZWVkIHRvIHJlYWQuXG4gICAgLy8gVGhpcyBpcyB1bmZvcnR1bmF0ZSBzaW5jZSB3ZSBjYW4ndCBwYXJhbGxlbGl6ZSByZWFkcy4gV2hpY2ggbWVhbnNcbiAgICAvLyBwcmVmZXRjaGluZyBvZiBjaGFpbmVkIHN0cmVhbXMgaXMgYSBuby1vcC5cbiAgICAvLyBPbmUgc29sdXRpb24gaXMgdG8gcHJlZmV0Y2ggaW1tZWRpYXRlbHkgdXBzdHJlYW0gb2YgdGhpcy5cbiAgICBhd2FpdCBsYXN0UmVhZDtcbiAgICBpZiAodGhpcy5pdGVyYXRvciA9PSBudWxsKSB7XG4gICAgICBjb25zdCBpdGVyYXRvclJlc3VsdCA9IGF3YWl0IHRoaXMubW9yZUl0ZXJhdG9ycy5uZXh0KCk7XG4gICAgICBpZiAoaXRlcmF0b3JSZXN1bHQuZG9uZSkge1xuICAgICAgICAvLyBObyBtb3JlIHN0cmVhbXMgdG8gc3RyZWFtIGZyb20uXG4gICAgICAgIHJldHVybiB7dmFsdWU6IG51bGwsIGRvbmU6IHRydWV9O1xuICAgICAgfVxuICAgICAgdGhpcy5pdGVyYXRvciA9IGl0ZXJhdG9yUmVzdWx0LnZhbHVlO1xuICAgICAgaWYgKHRoaXMuYmFzZUVycm9ySGFuZGxlciAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuaXRlcmF0b3IgPSB0aGlzLml0ZXJhdG9yLmhhbmRsZUVycm9ycyh0aGlzLmJhc2VFcnJvckhhbmRsZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBpdGVtUmVzdWx0ID0gYXdhaXQgdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgaWYgKGl0ZW1SZXN1bHQuZG9uZSkge1xuICAgICAgdGhpcy5pdGVyYXRvciA9IG51bGw7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkRnJvbUNoYWluKGxhc3RSZWFkKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1SZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGVudW0gWmlwTWlzbWF0Y2hNb2RlIHtcbiAgRkFJTCwgICAgICAvLyByZXF1aXJlIHppcHBlZCBzdHJlYW1zIHRvIGhhdmUgdGhlIHNhbWUgbGVuZ3RoXG4gIFNIT1JURVNULCAgLy8gdGVybWluYXRlIHppcCB3aGVuIHRoZSBmaXJzdCBzdHJlYW0gaXMgZXhoYXVzdGVkXG4gIExPTkdFU1QgICAgLy8gdXNlIG51bGxzIGZvciBleGhhdXN0ZWQgc3RyZWFtczsgdXNlIHVwIHRoZSBsb25nZXN0IHN0cmVhbS5cbn1cblxuLyoqXG4gKiBQcm92aWRlcyBhIGBMYXp5SXRlcmF0b3JgIHRoYXQgemlwcyB0b2dldGhlciBhbiBhcnJheSwgZGljdCwgb3IgbmVzdGVkXG4gKiBzdHJ1Y3R1cmUgb2YgYExhenlJdGVyYXRvcmBzIChhbmQgcGVyaGFwcyBhZGRpdGlvbmFsIGNvbnN0YW50cykuXG4gKlxuICogVGhlIHVuZGVybHlpbmcgc3RyZWFtcyBtdXN0IHByb3ZpZGUgZWxlbWVudHMgaW4gYSBjb25zaXN0ZW50IG9yZGVyIHN1Y2hcbiAqIHRoYXQgdGhleSBjb3JyZXNwb25kLlxuICpcbiAqIFR5cGljYWxseSwgdGhlIHVuZGVybHlpbmcgc3RyZWFtcyBzaG91bGQgaGF2ZSB0aGUgc2FtZSBudW1iZXIgb2ZcbiAqIGVsZW1lbnRzLiBJZiB0aGV5IGRvIG5vdCwgdGhlIGJlaGF2aW9yIGlzIGRldGVybWluZWQgYnkgdGhlXG4gKiBgbWlzbWF0Y2hNb2RlYCBhcmd1bWVudC5cbiAqXG4gKiBUaGUgbmVzdGVkIHN0cnVjdHVyZSBvZiB0aGUgYGl0ZXJhdG9yc2AgYXJndW1lbnQgZGV0ZXJtaW5lcyB0aGVcbiAqIHN0cnVjdHVyZSBvZiBlbGVtZW50cyBpbiB0aGUgcmVzdWx0aW5nIGl0ZXJhdG9yLlxuICpcbiAqIERvaW5nIHRoaXMgaW4gYSBjb25jdXJyZW5jeS1zYWZlIHdheSByZXF1aXJlcyBzb21lIHRyaWNrZXJ5LiAgSW5cbiAqIHBhcnRpY3VsYXIsIHdlIHdhbnQgdGhpcyBzdHJlYW0gdG8gcmV0dXJuIHRoZSBlbGVtZW50cyBmcm9tIHRoZVxuICogdW5kZXJseWluZyBzdHJlYW1zIGluIHRoZSBjb3JyZWN0IG9yZGVyIGFjY29yZGluZyB0byB3aGVuIG5leHQoKSB3YXNcbiAqIGNhbGxlZCwgZXZlbiBpZiB0aGUgcmVzdWx0aW5nIFByb21pc2VzIHJlc29sdmUgaW4gYSBkaWZmZXJlbnQgb3JkZXIuXG4gKlxuICogQHBhcmFtIGl0ZXJhdG9yczogQW4gYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5pbmcgTGF6eUl0ZXJhdG9ycyBhdCB0aGVcbiAqIGxlYXZlcy5cbiAqIEBwYXJhbSBtaXNtYXRjaE1vZGU6IERldGVybWluZXMgd2hhdCB0byBkbyB3aGVuIG9uZSB1bmRlcmx5aW5nIGl0ZXJhdG9yXG4gKiBpcyBleGhhdXN0ZWQgYmVmb3JlIHRoZSBvdGhlcnMuICBgWmlwTWlzbWF0Y2hNb2RlLkZBSUxgICh0aGUgZGVmYXVsdClcbiAqIGNhdXNlcyBhbiBlcnJvciB0byBiZSB0aHJvd24gaW4gdGhpcyBjYXNlLiAgYFppcE1pc21hdGNoTW9kZS5TSE9SVEVTVGBcbiAqIGNhdXNlcyB0aGUgemlwcGVkIGl0ZXJhdG9yIHRvIHRlcm1pbmF0ZSB3aXRoIHRoZSBmdXJzdCB1bmRlcmx5aW5nXG4gKiBzdHJlYW1zLCBzbyBlbGVtZW50cyByZW1haW5pbmcgb24gdGhlIGxvbmdlciBzdHJlYW1zIGFyZSBpZ25vcmVkLlxuICogYFppcE1pc21hdGNoTW9kZS5MT05HRVNUYCBjYXVzZXMgdGhlIHppcHBlZCBzdHJlYW0gdG8gY29udGludWUsIGZpbGxpbmdcbiAqIGluIG51bGxzIGZvciB0aGUgZXhoYXVzdGVkIHN0cmVhbXMsIHVudGlsIGFsbCBzdHJlYW1zIGFyZSBleGhhdXN0ZWQuXG4gKi9cbmNsYXNzIFppcEl0ZXJhdG9yPE8gZXh0ZW5kcyB0Zi5UZW5zb3JDb250YWluZXI+IGV4dGVuZHMgTGF6eUl0ZXJhdG9yPE8+IHtcbiAgcHJpdmF0ZSBjb3VudCA9IDA7XG4gIHByaXZhdGUgY3VycmVudFByb21pc2U6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8Tz4+ID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByb3RlY3RlZCByZWFkb25seSBpdGVyYXRvcnM6IEl0ZXJhdG9yQ29udGFpbmVyLFxuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IG1pc21hdGNoTW9kZTogWmlwTWlzbWF0Y2hNb2RlID0gWmlwTWlzbWF0Y2hNb2RlLkZBSUwpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgc3VtbWFyeSgpIHtcbiAgICBjb25zdCB1cHN0cmVhbVN1bW1hcmllcyA9ICdUT0RPOiBmaWxsIGluIHVwc3RyZWFtIG9mIHppcCBzdW1tYXJpZXMnO1xuICAgIHJldHVybiBgeyR7dXBzdHJlYW1TdW1tYXJpZXN9fSAtPiBaaXBgO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBuZXh0U3RhdGUoYWZ0ZXJTdGF0ZTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxPPj4pOlxuICAgICAgUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxPPj4ge1xuICAgIC8vIFRoaXMgY2hhaW5pbmcgZW5zdXJlcyB0aGF0IHRoZSB1bmRlcmx5aW5nIG5leHQoKSBhcmUgbm90IGV2ZW4gY2FsbGVkXG4gICAgLy8gYmVmb3JlIHRoZSBwcmV2aW91cyBvbmVzIGhhdmUgcmVzb2x2ZWQuXG4gICAgYXdhaXQgYWZ0ZXJTdGF0ZTtcblxuICAgIC8vIENvbGxlY3QgdW5kZXJseWluZyBpdGVyYXRvciBcImRvbmVcIiBzaWduYWxzIGFzIGEgc2lkZSBlZmZlY3QgaW5cbiAgICAvLyBnZXROZXh0KClcbiAgICBsZXQgbnVtSXRlcmF0b3JzID0gMDtcbiAgICBsZXQgaXRlcmF0b3JzRG9uZSA9IDA7XG5cbiAgICBmdW5jdGlvbiBnZXROZXh0KGNvbnRhaW5lcjogSXRlcmF0b3JDb250YWluZXIpOiBEZWVwTWFwQXN5bmNSZXN1bHQge1xuICAgICAgaWYgKGNvbnRhaW5lciBpbnN0YW5jZW9mIExhenlJdGVyYXRvcikge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBjb250YWluZXIubmV4dCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhbHVlOiByZXN1bHQudGhlbih4ID0+IHtcbiAgICAgICAgICAgIG51bUl0ZXJhdG9ycysrO1xuICAgICAgICAgICAgaWYgKHguZG9uZSkge1xuICAgICAgICAgICAgICBpdGVyYXRvcnNEb25lKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geC52YWx1ZTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICByZWN1cnNlOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHt2YWx1ZTogbnVsbCwgcmVjdXJzZTogdHJ1ZX07XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbWFwcGVkOiBPID0gYXdhaXQgZGVlcE1hcEFuZEF3YWl0QWxsKHRoaXMuaXRlcmF0b3JzLCBnZXROZXh0KTtcblxuICAgIGlmIChudW1JdGVyYXRvcnMgPT09IGl0ZXJhdG9yc0RvbmUpIHtcbiAgICAgIC8vIFRoZSBzdHJlYW1zIGhhdmUgYWxsIGVuZGVkLlxuICAgICAgcmV0dXJuIHt2YWx1ZTogbnVsbCwgZG9uZTogdHJ1ZX07XG4gICAgfVxuICAgIGlmIChpdGVyYXRvcnNEb25lID4gMCkge1xuICAgICAgc3dpdGNoICh0aGlzLm1pc21hdGNoTW9kZSkge1xuICAgICAgICBjYXNlIFppcE1pc21hdGNoTW9kZS5GQUlMOlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgJ1ppcHBlZCBzdHJlYW1zIHNob3VsZCBoYXZlIHRoZSBzYW1lIGxlbmd0aC4gJyArXG4gICAgICAgICAgICAgIGBNaXNtYXRjaGVkIGF0IGVsZW1lbnQgJHt0aGlzLmNvdW50fS5gKTtcbiAgICAgICAgY2FzZSBaaXBNaXNtYXRjaE1vZGUuU0hPUlRFU1Q6XG4gICAgICAgICAgcmV0dXJuIHt2YWx1ZTogbnVsbCwgZG9uZTogdHJ1ZX07XG4gICAgICAgIGNhc2UgWmlwTWlzbWF0Y2hNb2RlLkxPTkdFU1Q6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gQ29udGludWUuICBUaGUgZXhoYXVzdGVkIHN0cmVhbXMgYWxyZWFkeSBwcm9kdWNlZCB2YWx1ZTogbnVsbC5cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvdW50Kys7XG4gICAgcmV0dXJuIHt2YWx1ZTogbWFwcGVkLCBkb25lOiBmYWxzZX07XG4gIH1cblxuICBhc3luYyBuZXh0KCk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8Tz4+IHtcbiAgICB0aGlzLmN1cnJlbnRQcm9taXNlID0gdGhpcy5uZXh0U3RhdGUodGhpcy5jdXJyZW50UHJvbWlzZSk7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFByb21pc2U7XG4gIH1cbn1cblxuLy8gSXRlcmF0b3JzIHRoYXQgbWFpbnRhaW4gYSByaW5nIGJ1ZmZlciBvZiBwZW5kaW5nIHByb21pc2VzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogQSBzdHJlYW0gdGhhdCBwcmVmZXRjaGVzIGEgZ2l2ZW4gbnVtYmVyIG9mIGl0ZW1zIGZyb20gYW4gdXBzdHJlYW0gc291cmNlLFxuICogcmV0dXJuaW5nIHRoZW0gaW4gRklGTyBvcmRlci5cbiAqXG4gKiBOb3RlIHRoaXMgcHJlZmV0Y2hlcyBQcm9taXNlcywgYnV0IG1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgd2hlbiB0aG9zZVxuICogUHJvbWlzZXMgcmVzb2x2ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFByZWZldGNoSXRlcmF0b3I8VD4gZXh0ZW5kcyBMYXp5SXRlcmF0b3I8VD4ge1xuICBwcm90ZWN0ZWQgYnVmZmVyOiBSaW5nQnVmZmVyPFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByb3RlY3RlZCB1cHN0cmVhbTogTGF6eUl0ZXJhdG9yPFQ+LCBwcm90ZWN0ZWQgYnVmZmVyU2l6ZTogbnVtYmVyKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmJ1ZmZlciA9IG5ldyBSaW5nQnVmZmVyPFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+PihidWZmZXJTaXplKTtcbiAgfVxuXG4gIHN1bW1hcnkoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMudXBzdHJlYW0uc3VtbWFyeSgpfSAtPiBQcmVmZXRjaGA7XG4gIH1cblxuICAvKipcbiAgICogUmVmaWxsIHRoZSBwcmVmZXRjaCBidWZmZXIuICBSZXR1cm5zIG9ubHkgYWZ0ZXIgdGhlIGJ1ZmZlciBpcyBmdWxsLCBvclxuICAgKiB0aGUgdXBzdHJlYW0gc291cmNlIGlzIGV4aGF1c3RlZC5cbiAgICovXG4gIHByb3RlY3RlZCByZWZpbGwoKSB7XG4gICAgd2hpbGUgKCF0aGlzLmJ1ZmZlci5pc0Z1bGwoKSkge1xuICAgICAgY29uc3QgdiA9IHRoaXMudXBzdHJlYW0ubmV4dCgpO1xuICAgICAgdGhpcy5idWZmZXIucHVzaCh2KTtcbiAgICB9XG4gIH1cblxuICBuZXh0KCk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+IHtcbiAgICB0aGlzLnJlZmlsbCgpO1xuICAgIC8vIFRoaXMgc2hpZnQgd2lsbCBuZXZlciB0aHJvdyBhbiBlcnJvciBiZWNhdXNlIHRoZSBidWZmZXIgaXMgYWx3YXlzXG4gICAgLy8gZnVsbCBhZnRlciBhIHJlZmlsbC4gSWYgdGhlIHN0cmVhbSBpcyBleGhhdXN0ZWQsIHRoZSBidWZmZXIgd2lsbCBiZVxuICAgIC8vIGZ1bGwgb2YgUHJvbWlzZXMgdGhhdCB3aWxsIHJlc29sdmUgdG8gdGhlIGVuZC1vZi1zdHJlYW0gc2lnbmFsLlxuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5zaGlmdCgpO1xuICB9XG59XG5cbi8qKlxuICogQSBzdHJlYW0gdGhhdCBwZXJmb3JtcyBhIHNsaWRpbmctd2luZG93IHJhbmRvbSBzaHVmZmxlIG9uIGFuIHVwc3RyZWFtXG4gKiBzb3VyY2UuIFRoaXMgaXMgbGlrZSBhIGBQcmVmZXRjaEl0ZXJhdG9yYCBleGNlcHQgdGhhdCB0aGUgaXRlbXMgYXJlXG4gKiByZXR1cm5lZCBpbiByYW5kb21pemVkIG9yZGVyLiAgTWl4aW5nIG5hdHVyYWxseSBpbXByb3ZlcyBhcyB0aGUgYnVmZmVyXG4gKiBzaXplIGluY3JlYXNlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNodWZmbGVJdGVyYXRvcjxUPiBleHRlbmRzIFByZWZldGNoSXRlcmF0b3I8VD4ge1xuICBwcml2YXRlIHJlYWRvbmx5IHJhbmRvbTogc2VlZHJhbmRvbS5wcm5nO1xuXG4gIC8vIFN0cmljdCBQcm9taXNlIGV4ZWN1dGlvbiBvcmRlcjpcbiAgLy8gYSBuZXh0KCkgY2FsbCBtYXkgbm90IGV2ZW4gYmVnaW4gdW50aWwgdGhlIHByZXZpb3VzIG9uZSBjb21wbGV0ZXMuXG4gIHByaXZhdGUgbGFzdFJlYWQ6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+O1xuXG4gIC8vIExvY2FsIHN0YXRlIHRoYXQgc2hvdWxkIG5vdCBiZSBjbG9iYmVyZWQgYnkgb3V0LW9mLW9yZGVyIGV4ZWN1dGlvbi5cbiAgcHJpdmF0ZSB1cHN0cmVhbUV4aGF1c3RlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJvdGVjdGVkIHVwc3RyZWFtOiBMYXp5SXRlcmF0b3I8VD4sIHByb3RlY3RlZCB3aW5kb3dTaXplOiBudW1iZXIsXG4gICAgICBzZWVkPzogc3RyaW5nKSB7XG4gICAgc3VwZXIodXBzdHJlYW0sIHdpbmRvd1NpemUpO1xuICAgIHRoaXMucmFuZG9tID0gc2VlZHJhbmRvbS5hbGVhKHNlZWQgfHwgdGYudXRpbC5ub3coKS50b1N0cmluZygpKTtcbiAgICB0aGlzLmxhc3RSZWFkID0gUHJvbWlzZS5yZXNvbHZlKHt2YWx1ZTogbnVsbCwgZG9uZTogZmFsc2V9KTtcbiAgfVxuXG4gIGFzeW5jIG5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj4ge1xuICAgIC8vIFRoaXMgc2V0cyB0aGlzLmxhc3RSZWFkIHRvIGEgbmV3IFByb21pc2UgcmlnaHQgYXdheSwgYXMgb3Bwb3NlZCB0b1xuICAgIC8vIHNheWluZyBgYXdhaXQgdGhpcy5sYXN0UmVhZDsgdGhpcy5sYXN0UmVhZCA9IHRoaXMuc2VyaWFsTmV4dCgpO2Agd2hpY2hcbiAgICAvLyB3b3VsZCBub3Qgd29yayBiZWNhdXNlIHRoaXMubmV4dFJlYWQgd291bGQgYmUgdXBkYXRlZCBvbmx5IGFmdGVyIHRoZVxuICAgIC8vIHByb21pc2UgcmVzb2x2ZXMuXG4gICAgdGhpcy5sYXN0UmVhZCA9IHRoaXMubGFzdFJlYWQudGhlbigoKSA9PiB0aGlzLnNlcmlhbE5leHQoKSk7XG4gICAgcmV0dXJuIHRoaXMubGFzdFJlYWQ7XG4gIH1cblxuICBwcml2YXRlIHJhbmRvbUludChtYXg6IG51bWJlcikge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMucmFuZG9tKCkgKiBtYXgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNob29zZUluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucmFuZG9tSW50KHRoaXMuYnVmZmVyLmxlbmd0aCgpKTtcbiAgfVxuXG4gIGFzeW5jIHNlcmlhbE5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj4ge1xuICAgIC8vIFRPRE8oc29lcmdlbCk6IGNvbnNpZGVyIHBlcmZvcm1hbmNlXG4gICAgaWYgKCF0aGlzLnVwc3RyZWFtRXhoYXVzdGVkKSB7XG4gICAgICB0aGlzLnJlZmlsbCgpO1xuICAgIH1cbiAgICB3aGlsZSAoIXRoaXMuYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgY29uc3QgY2hvc2VuSW5kZXggPSB0aGlzLmNob29zZUluZGV4KCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmJ1ZmZlci5zaHVmZmxlRXhjaXNlKGNob3NlbkluZGV4KTtcbiAgICAgIGlmIChyZXN1bHQuZG9uZSkge1xuICAgICAgICB0aGlzLnVwc3RyZWFtRXhoYXVzdGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVmaWxsKCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7dmFsdWU6IG51bGwsIGRvbmU6IHRydWV9O1xuICB9XG59XG4iXX0=