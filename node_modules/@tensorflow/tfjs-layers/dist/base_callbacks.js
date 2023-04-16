/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/* Original source: keras/callbacks.py */
import { add, div, keep, mul, nextFrame, tidy, util } from '@tensorflow/tfjs-core';
import { ValueError } from './errors';
import { resolveScalarsInLogs } from './logs';
import * as generic_utils from './utils/generic_utils';
/** Verbosity logging level when fitting a model. */
export var ModelLoggingVerbosity;
(function (ModelLoggingVerbosity) {
    ModelLoggingVerbosity[ModelLoggingVerbosity["SILENT"] = 0] = "SILENT";
    ModelLoggingVerbosity[ModelLoggingVerbosity["VERBOSE"] = 1] = "VERBOSE";
})(ModelLoggingVerbosity || (ModelLoggingVerbosity = {}));
/** How often to yield to the main thread when training (in ms). */
export const DEFAULT_YIELD_EVERY_MS = 125;
/**
 * Abstract base class used to build new callbacks.
 *
 * The `logs` dictionary that callback methods take as argument will contain
 * keys for quantities relevant to the current batch or epoch.
 *
 * Currently, the `.fit()` method of the `Sequential` model class
 * will include the following quantities in the `logs` that
 * it passes to its callbacks:
 *
 * onEpochEnd: Logs include `acc` and `loss`, and optionally include `valLoss`
 *   (if validation is enabled in `fit`), and `valAcc` (if validation and
 *   accuracy monitoring are enabled).
 * onBatchBegin: Logs include `size`, the number of samples in the current
 *   batch.
 * onBatchEnd: Logs include `loss`, and optionally `acc` (if accuracy monitoring
 *   is enabled).
 */
export class BaseCallback {
    constructor() {
        // TODO(michaelterry): This type is a best guess.
        this.validationData = null;
    }
    setParams(params) {
        this.params = params;
    }
    async onEpochBegin(epoch, logs) { }
    async onEpochEnd(epoch, logs) { }
    async onBatchBegin(batch, logs) { }
    async onBatchEnd(batch, logs) { }
    async onTrainBegin(logs) { }
    async onTrainEnd(logs) { }
    // LayersModel needs to call Callback.setModel(), but cannot actually depend
    // on Callback because that creates a cyclic dependency.  Providing this no-op
    // method on BaseCallback breaks the cycle: this way LayersModel can depend on
    // BaseCallback but not on Callback.  The argument is typed as `Container`
    // (the superclass of LayersModel) to avoid recapitulating the cycle. Callback
    // overrides this method and enforces that the argument is really a
    // LayersModel.
    setModel(model) {
        // Do nothing. Use Callback instead of BaseCallback to track the model.
    }
}
/**
 * Container abstracting a list of callbacks.
 */
export class CallbackList {
    // TODO(cais): When the need arises, uncomment the following lines and
    // implement the queue for time values.
    // private deltaTBatch: number;
    // private deltaTsBatchBegin: Array<number>;
    // private deltaTsBatchEnd: Array<number>;
    /**
     * Constructor of CallbackList.
     * @param callbacks Array of `Callback` instances.
     * @param queueLength Queue length for keeping running statistics over
     *   callback execution time.
     */
    constructor(callbacks, queueLength = 10) {
        // TODO(cais): Make use of queueLength when implementing the queue for time
        // values.
        if (callbacks == null) {
            callbacks = [];
        }
        this.callbacks = callbacks;
        this.queueLength = queueLength;
    }
    append(callback) {
        this.callbacks.push(callback);
    }
    setParams(params) {
        for (const callback of this.callbacks) {
            callback.setParams(params);
        }
    }
    setModel(model) {
        for (const callback of this.callbacks) {
            callback.setModel(model);
        }
    }
    /**
     * Called at the start of an epoch.
     * @param epoch Index of epoch.
     * @param logs Dictionary of logs.
     */
    async onEpochBegin(epoch, logs) {
        if (logs == null) {
            logs = {};
        }
        for (const callback of this.callbacks) {
            await callback.onEpochBegin(epoch, logs);
        }
    }
    /**
     * Called at the end of an epoch.
     * @param epoch Index of epoch.
     * @param logs Dictionary of logs.
     */
    async onEpochEnd(epoch, logs) {
        if (logs == null) {
            logs = {};
        }
        for (const callback of this.callbacks) {
            await callback.onEpochEnd(epoch, logs);
        }
    }
    /**
     * Called  right before processing a batch.
     * @param batch Index of batch within the current epoch.
     * @param logs Dictionary of logs.
     */
    async onBatchBegin(batch, logs) {
        if (logs == null) {
            logs = {};
        }
        for (const callback of this.callbacks) {
            await callback.onBatchBegin(batch, logs);
        }
    }
    /**
     * Called at the end of a batch.
     * @param batch Index of batch within the current epoch.
     * @param logs Dictionary of logs.
     */
    async onBatchEnd(batch, logs) {
        if (logs == null) {
            logs = {};
        }
        for (const callback of this.callbacks) {
            await callback.onBatchEnd(batch, logs);
        }
    }
    /**
     * Called at the beginning of training.
     * @param logs Dictionary of logs.
     */
    async onTrainBegin(logs) {
        if (logs == null) {
            logs = {};
        }
        for (const callback of this.callbacks) {
            await callback.onTrainBegin(logs);
        }
    }
    /**
     * Called at the end of training.
     * @param logs Dictionary of logs.
     */
    async onTrainEnd(logs) {
        if (logs == null) {
            logs = {};
        }
        for (const callback of this.callbacks) {
            await callback.onTrainEnd(logs);
        }
    }
}
/**
 * Callback that accumulates epoch averages of metrics.
 *
 * This callback is automatically applied to every LayersModel.
 */
export class BaseLogger extends BaseCallback {
    constructor() {
        super();
    }
    async onEpochBegin(epoch) {
        this.seen = 0;
        this.totals = {};
    }
    async onBatchEnd(batch, logs) {
        if (logs == null) {
            logs = {};
        }
        const batchSize = logs['size'] == null ? 0 : logs['size'];
        this.seen += batchSize;
        for (const key in logs) {
            const value = logs[key];
            if (typeof value === 'number') {
                if (!this.totals.hasOwnProperty(key)) {
                    this.totals[key] = 0;
                }
                this.totals[key] = this.totals[key] + value * batchSize;
            }
            else {
                let oldTotalsToDispose;
                if (key in this.totals) {
                    oldTotalsToDispose = this.totals[key];
                }
                else {
                    this.totals[key] = 0;
                }
                const total = tidy(() => add((this.totals[key]), mul(value, batchSize)));
                this.totals[key] = total;
                if (oldTotalsToDispose != null) {
                    oldTotalsToDispose.dispose();
                }
            }
        }
    }
    async onEpochEnd(epoch, logs) {
        if (logs != null) {
            for (const key of this.params['metrics']) {
                if (this.totals[key] == null) {
                    continue;
                }
                if (typeof this.totals[key] === 'number') {
                    logs[key] = this.totals[key] / this.seen;
                }
                else {
                    tidy(() => {
                        const log = mul(div(1, this.seen), this.totals[key]);
                        logs[key] = log;
                        this.totals[key].dispose();
                        keep(logs[key]);
                    });
                }
            }
        }
    }
}
/**
 * Callback that records events into a `History` object. This callback is
 * automatically applied to every TF.js Layers model. The `History` object
 * gets returned by the `fit` method of models.
 */
export class History extends BaseCallback {
    async onTrainBegin(logs) {
        this.epoch = [];
        this.history = {};
    }
    async onEpochEnd(epoch, logs) {
        if (logs == null) {
            logs = {};
        }
        this.epoch.push(epoch);
        for (const key in logs) {
            if (this.history[key] == null) {
                this.history[key] = [];
            }
            this.history[key].push(logs[key]);
        }
    }
    /**
     * Await the values of all losses and metrics.
     */
    async syncData() {
        const promises = [];
        const keys = [];
        const indices = [];
        for (const key in this.history) {
            const valueArray = this.history[key];
            for (let i = 0; i < valueArray.length; ++i) {
                if (typeof valueArray[i] !== 'number') {
                    const valueScalar = valueArray[i];
                    promises.push(valueScalar.data());
                    keys.push(key);
                    indices.push(i);
                }
            }
        }
        const values = await Promise.all(promises);
        for (let n = 0; n < values.length; ++n) {
            const tensorToDispose = this.history[keys[n]][indices[n]];
            tensorToDispose.dispose();
            this.history[keys[n]][indices[n]] = values[n][0];
        }
    }
}
/**
 * Custom callback for training.
 */
export class CustomCallback extends BaseCallback {
    constructor(args, yieldEvery) {
        super();
        this.currentEpoch = 0;
        this.nowFunc = args.nowFunc;
        this.nextFrameFunc = args.nextFrameFunc || nextFrame;
        this.yieldEvery = yieldEvery || 'auto';
        if (this.yieldEvery === 'auto') {
            this.yieldEvery = DEFAULT_YIELD_EVERY_MS;
        }
        if (this.yieldEvery === 'never' && args.onYield != null) {
            throw new Error('yieldEvery is `never` but you provided an `onYield` callback. ' +
                'Either change `yieldEvery` or remove the callback');
        }
        if (util.isNumber(this.yieldEvery)) {
            // Decorate `maybeWait` so it will be called at most once every
            // `yieldEvery` ms.
            this.maybeWait = generic_utils.debounce(this.maybeWait.bind(this), this.yieldEvery, this.nowFunc);
        }
        this.trainBegin = args.onTrainBegin;
        this.trainEnd = args.onTrainEnd;
        this.epochBegin = args.onEpochBegin;
        this.epochEnd = args.onEpochEnd;
        this.batchBegin = args.onBatchBegin;
        this.batchEnd = args.onBatchEnd;
        this.yield = args.onYield;
    }
    async maybeWait(epoch, batch, logs) {
        const ps = [];
        if (this.yield != null) {
            await resolveScalarsInLogs(logs);
            ps.push(this.yield(epoch, batch, logs));
        }
        ps.push(this.nextFrameFunc());
        await Promise.all(ps);
    }
    async onEpochBegin(epoch, logs) {
        this.currentEpoch = epoch;
        if (this.epochBegin != null) {
            await resolveScalarsInLogs(logs);
            await this.epochBegin(epoch, logs);
        }
    }
    async onEpochEnd(epoch, logs) {
        const ps = [];
        if (this.epochEnd != null) {
            await resolveScalarsInLogs(logs);
            ps.push(this.epochEnd(epoch, logs));
        }
        if (this.yieldEvery === 'epoch') {
            ps.push(this.nextFrameFunc());
        }
        await Promise.all(ps);
    }
    async onBatchBegin(batch, logs) {
        if (this.batchBegin != null) {
            await resolveScalarsInLogs(logs);
            await this.batchBegin(batch, logs);
        }
    }
    async onBatchEnd(batch, logs) {
        const ps = [];
        if (this.batchEnd != null) {
            await resolveScalarsInLogs(logs);
            ps.push(this.batchEnd(batch, logs));
        }
        if (this.yieldEvery === 'batch') {
            ps.push(this.nextFrameFunc());
        }
        else if (util.isNumber(this.yieldEvery)) {
            ps.push(this.maybeWait(this.currentEpoch, batch, logs));
        }
        await Promise.all(ps);
    }
    async onTrainBegin(logs) {
        if (this.trainBegin != null) {
            await resolveScalarsInLogs(logs);
            await this.trainBegin(logs);
        }
    }
    async onTrainEnd(logs) {
        if (this.trainEnd != null) {
            await resolveScalarsInLogs(logs);
            await this.trainEnd(logs);
        }
    }
}
/**
 * Standardize callbacks or configurations of them to an Array of callbacks.
 */
export function standardizeCallbacks(callbacks, yieldEvery) {
    if (callbacks == null) {
        callbacks = {};
    }
    if (callbacks instanceof BaseCallback) {
        return [callbacks];
    }
    if (Array.isArray(callbacks) && callbacks[0] instanceof BaseCallback) {
        return callbacks;
    }
    // Convert custom callback configs to custom callback objects.
    const callbackConfigs = generic_utils.toList(callbacks);
    return callbackConfigs.map(callbackConfig => new CustomCallback(callbackConfig, yieldEvery));
}
/**
 * A global registry for callback constructors to be used during
 * LayersModel.fit().
 */
export class CallbackConstructorRegistry {
    /**
     * Blocks public access to constructor.
     */
    constructor() { }
    /**
     * Register a tf.LayersModel.fit() callback constructor.
     *
     * The registered callback constructor will be used to instantiate
     * callbacks for every tf.LayersModel.fit() call afterwards.
     *
     * @param verbosityLevel Level of verbosity at which the `callbackConstructor`
     *   is to be reigstered.
     * @param callbackConstructor A no-arg constructor for `tf.Callback`.
     * @throws Error, if the same callbackConstructor has been registered before,
     *   either at the same or a different `verbosityLevel`.
     */
    static registerCallbackConstructor(verbosityLevel, callbackConstructor) {
        util.assert(verbosityLevel >= 0 && Number.isInteger(verbosityLevel), () => `Verbosity level is expected to be an integer >= 0, ` +
            `but got ${verbosityLevel}`);
        CallbackConstructorRegistry.checkForDuplicate(callbackConstructor);
        if (CallbackConstructorRegistry.constructors[verbosityLevel] == null) {
            CallbackConstructorRegistry.constructors[verbosityLevel] = [];
        }
        CallbackConstructorRegistry.constructors[verbosityLevel].push(callbackConstructor);
    }
    static checkForDuplicate(callbackConstructor) {
        for (const levelName in CallbackConstructorRegistry.constructors) {
            const constructors = CallbackConstructorRegistry.constructors[+levelName];
            constructors.forEach(ctor => {
                if (ctor === callbackConstructor) {
                    throw new ValueError('Duplicate callback constructor.');
                }
            });
        }
    }
    /**
     * Clear all registered callback constructors.
     */
    static clear() {
        CallbackConstructorRegistry.constructors = {};
    }
    /**
     * Create callbacks using the registered callback constructors.
     *
     * Given `verbosityLevel`, all constructors registered at that level or above
     * will be called and the instantiated callbacks will be used.
     *
     * @param verbosityLevel: Level of verbosity.
     */
    static createCallbacks(verbosityLevel) {
        const constructors = [];
        for (const levelName in CallbackConstructorRegistry.constructors) {
            const level = +levelName;
            if (verbosityLevel >= level) {
                constructors.push(...CallbackConstructorRegistry.constructors[level]);
            }
        }
        return constructors.map(ctor => new ctor());
    }
}
CallbackConstructorRegistry.constructors = {};
export function configureCallbacks(callbacks, verbose, epochs, initialEpoch, numTrainSamples, stepsPerEpoch, batchSize, doValidation, callbackMetrics) {
    const history = new History();
    const actualCallbacks = [
        new BaseLogger(), ...CallbackConstructorRegistry.createCallbacks(verbose)
    ];
    if (callbacks != null) {
        actualCallbacks.push(...callbacks);
    }
    actualCallbacks.push(history);
    const callbackList = new CallbackList(actualCallbacks);
    // TODO(cais): Figure out when this LayersModel instance can have a
    // dynamically
    //   set property called 'callback_model' as in PyKeras.
    callbackList.setParams({
        epochs,
        initialEpoch,
        samples: numTrainSamples,
        steps: stepsPerEpoch,
        batchSize,
        verbose,
        doValidation,
        metrics: callbackMetrics,
    });
    return { callbackList, history };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZV9jYWxsYmFja3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvYmFzZV9jYWxsYmFja3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0dBUUc7QUFFSCx5Q0FBeUM7QUFFekMsT0FBTyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQWtCLElBQUksRUFBRSxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUdqRyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3BDLE9BQU8sRUFBTyxvQkFBb0IsRUFBaUIsTUFBTSxRQUFRLENBQUM7QUFDbEUsT0FBTyxLQUFLLGFBQWEsTUFBTSx1QkFBdUIsQ0FBQztBQUV2RCxvREFBb0Q7QUFDcEQsTUFBTSxDQUFOLElBQVkscUJBR1g7QUFIRCxXQUFZLHFCQUFxQjtJQUMvQixxRUFBVSxDQUFBO0lBQ1YsdUVBQVcsQ0FBQTtBQUNiLENBQUMsRUFIVyxxQkFBcUIsS0FBckIscUJBQXFCLFFBR2hDO0FBRUQsbUVBQW1FO0FBQ25FLE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLEdBQUcsQ0FBQztBQVExQzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxNQUFNLE9BQWdCLFlBQVk7SUFBbEM7UUFDRSxpREFBaUQ7UUFDakQsbUJBQWMsR0FBb0IsSUFBSSxDQUFDO0lBZ0N6QyxDQUFDO0lBMUJDLFNBQVMsQ0FBQyxNQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQWEsRUFBRSxJQUFxQixJQUFHLENBQUM7SUFFM0QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFhLEVBQUUsSUFBcUIsSUFBRyxDQUFDO0lBRXpELEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBYSxFQUFFLElB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RSxZQUFxQixFQUN4QyxlQUF5QjtJQUMzQixNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQzlCLE1BQU0sZUFBZSxHQUFtQjtRQUN0QyxJQUFJLFVBQVUsRUFBRSxFQUFFLEdBQUcsMkJBQTJCLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztLQUMxRSxDQUFDO0lBQ0YsSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO1FBQ3JCLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztLQUNwQztJQUNELGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFdkQsbUVBQW1FO0lBQ25FLGNBQWM7SUFDZCx3REFBd0Q7SUFFeEQsWUFBWSxDQUFDLFNBQVMsQ0FBQztRQUNyQixNQUFNO1FBQ04sWUFBWTtRQUNaLE9BQU8sRUFBRSxlQUFlO1FBQ3hCLEtBQUssRUFBRSxhQUFhO1FBQ3BCLFNBQVM7UUFDVCxPQUFPO1FBQ1AsWUFBWTtRQUNaLE9BQU8sRUFBRSxlQUFlO0tBQ3pCLENBQUMsQ0FBQztJQUNILE9BQU8sRUFBQyxZQUFZLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDakMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAqIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8qIE9yaWdpbmFsIHNvdXJjZToga2VyYXMvY2FsbGJhY2tzLnB5ICovXG5cbmltcG9ydCB7YWRkLCBkaXYsIGtlZXAsIG11bCwgbmV4dEZyYW1lLCBTY2FsYXIsIFRlbnNvciwgdGlkeSwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4vZW5naW5lL2NvbnRhaW5lcic7XG5pbXBvcnQge1ZhbHVlRXJyb3J9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7TG9ncywgcmVzb2x2ZVNjYWxhcnNJbkxvZ3MsIFVucmVzb2x2ZWRMb2dzfSBmcm9tICcuL2xvZ3MnO1xuaW1wb3J0ICogYXMgZ2VuZXJpY191dGlscyBmcm9tICcuL3V0aWxzL2dlbmVyaWNfdXRpbHMnO1xuXG4vKiogVmVyYm9zaXR5IGxvZ2dpbmcgbGV2ZWwgd2hlbiBmaXR0aW5nIGEgbW9kZWwuICovXG5leHBvcnQgZW51bSBNb2RlbExvZ2dpbmdWZXJib3NpdHkge1xuICBTSUxFTlQgPSAwLFxuICBWRVJCT1NFID0gMVxufVxuXG4vKiogSG93IG9mdGVuIHRvIHlpZWxkIHRvIHRoZSBtYWluIHRocmVhZCB3aGVuIHRyYWluaW5nIChpbiBtcykuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9ZSUVMRF9FVkVSWV9NUyA9IDEyNTtcblxuZXhwb3J0IHR5cGUgUGFyYW1zID0ge1xuICBba2V5OiBzdHJpbmddOiBudW1iZXJ8c3RyaW5nfGJvb2xlYW58bnVtYmVyW118c3RyaW5nW118Ym9vbGVhbltdO1xufTtcblxuZXhwb3J0IHR5cGUgWWllbGRFdmVyeU9wdGlvbnMgPSAnYXV0byd8J2JhdGNoJ3wnZXBvY2gnfCduZXZlcid8bnVtYmVyO1xuXG4vKipcbiAqIEFic3RyYWN0IGJhc2UgY2xhc3MgdXNlZCB0byBidWlsZCBuZXcgY2FsbGJhY2tzLlxuICpcbiAqIFRoZSBgbG9nc2AgZGljdGlvbmFyeSB0aGF0IGNhbGxiYWNrIG1ldGhvZHMgdGFrZSBhcyBhcmd1bWVudCB3aWxsIGNvbnRhaW5cbiAqIGtleXMgZm9yIHF1YW50aXRpZXMgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgYmF0Y2ggb3IgZXBvY2guXG4gKlxuICogQ3VycmVudGx5LCB0aGUgYC5maXQoKWAgbWV0aG9kIG9mIHRoZSBgU2VxdWVudGlhbGAgbW9kZWwgY2xhc3NcbiAqIHdpbGwgaW5jbHVkZSB0aGUgZm9sbG93aW5nIHF1YW50aXRpZXMgaW4gdGhlIGBsb2dzYCB0aGF0XG4gKiBpdCBwYXNzZXMgdG8gaXRzIGNhbGxiYWNrczpcbiAqXG4gKiBvbkVwb2NoRW5kOiBMb2dzIGluY2x1ZGUgYGFjY2AgYW5kIGBsb3NzYCwgYW5kIG9wdGlvbmFsbHkgaW5jbHVkZSBgdmFsTG9zc2BcbiAqICAgKGlmIHZhbGlkYXRpb24gaXMgZW5hYmxlZCBpbiBgZml0YCksIGFuZCBgdmFsQWNjYCAoaWYgdmFsaWRhdGlvbiBhbmRcbiAqICAgYWNjdXJhY3kgbW9uaXRvcmluZyBhcmUgZW5hYmxlZCkuXG4gKiBvbkJhdGNoQmVnaW46IExvZ3MgaW5jbHVkZSBgc2l6ZWAsIHRoZSBudW1iZXIgb2Ygc2FtcGxlcyBpbiB0aGUgY3VycmVudFxuICogICBiYXRjaC5cbiAqIG9uQmF0Y2hFbmQ6IExvZ3MgaW5jbHVkZSBgbG9zc2AsIGFuZCBvcHRpb25hbGx5IGBhY2NgIChpZiBhY2N1cmFjeSBtb25pdG9yaW5nXG4gKiAgIGlzIGVuYWJsZWQpLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZUNhbGxiYWNrIHtcbiAgLy8gVE9ETyhtaWNoYWVsdGVycnkpOiBUaGlzIHR5cGUgaXMgYSBiZXN0IGd1ZXNzLlxuICB2YWxpZGF0aW9uRGF0YTogVGVuc29yfFRlbnNvcltdID0gbnVsbDtcbiAgLyoqXG4gICAqIFRyYWluaW5nIHBhcmFtZXRlcnMgKGVnLiB2ZXJib3NpdHksIGJhdGNoIHNpemUsIG51bWJlciBvZiBlcG9jaHMuLi4pLlxuICAgKi9cbiAgcGFyYW1zOiBQYXJhbXM7XG5cbiAgc2V0UGFyYW1zKHBhcmFtczogUGFyYW1zKTogdm9pZCB7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gIH1cblxuICBhc3luYyBvbkVwb2NoQmVnaW4oZXBvY2g6IG51bWJlciwgbG9ncz86IFVucmVzb2x2ZWRMb2dzKSB7fVxuXG4gIGFzeW5jIG9uRXBvY2hFbmQoZXBvY2g6IG51bWJlciwgbG9ncz86IFVucmVzb2x2ZWRMb2dzKSB7fVxuXG4gIGFzeW5jIG9uQmF0Y2hCZWdpbihiYXRjaDogbnVtYmVyLCBsb2dzPzogVW5yZXNvbHZlZExvZ3MpIHt9XG5cbiAgYXN5bmMgb25CYXRjaEVuZChiYXRjaDogbnVtYmVyLCBsb2dzPzogVW5yZXNvbHZlZExvZ3MpIHt9XG5cbiAgYXN5bmMgb25UcmFpbkJlZ2luKGxvZ3M/OiBVbnJlc29sdmVkTG9ncykge31cblxuICBhc3luYyBvblRyYWluRW5kKGxvZ3M/OiBVbnJlc29sdmVkTG9ncykge31cblxuICAvLyBMYXllcnNNb2RlbCBuZWVkcyB0byBjYWxsIENhbGxiYWNrLnNldE1vZGVsKCksIGJ1dCBjYW5ub3QgYWN0dWFsbHkgZGVwZW5kXG4gIC8vIG9uIENhbGxiYWNrIGJlY2F1c2UgdGhhdCBjcmVhdGVzIGEgY3ljbGljIGRlcGVuZGVuY3kuICBQcm92aWRpbmcgdGhpcyBuby1vcFxuICAvLyBtZXRob2Qgb24gQmFzZUNhbGxiYWNrIGJyZWFrcyB0aGUgY3ljbGU6IHRoaXMgd2F5IExheWVyc01vZGVsIGNhbiBkZXBlbmQgb25cbiAgLy8gQmFzZUNhbGxiYWNrIGJ1dCBub3Qgb24gQ2FsbGJhY2suICBUaGUgYXJndW1lbnQgaXMgdHlwZWQgYXMgYENvbnRhaW5lcmBcbiAgLy8gKHRoZSBzdXBlcmNsYXNzIG9mIExheWVyc01vZGVsKSB0byBhdm9pZCByZWNhcGl0dWxhdGluZyB0aGUgY3ljbGUuIENhbGxiYWNrXG4gIC8vIG92ZXJyaWRlcyB0aGlzIG1ldGhvZCBhbmQgZW5mb3JjZXMgdGhhdCB0aGUgYXJndW1lbnQgaXMgcmVhbGx5IGFcbiAgLy8gTGF5ZXJzTW9kZWwuXG4gIHNldE1vZGVsKG1vZGVsOiBDb250YWluZXIpOiB2b2lkIHtcbiAgICAvLyBEbyBub3RoaW5nLiBVc2UgQ2FsbGJhY2sgaW5zdGVhZCBvZiBCYXNlQ2FsbGJhY2sgdG8gdHJhY2sgdGhlIG1vZGVsLlxuICB9XG59XG5cbi8qKlxuICogQ29udGFpbmVyIGFic3RyYWN0aW5nIGEgbGlzdCBvZiBjYWxsYmFja3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBDYWxsYmFja0xpc3Qge1xuICBjYWxsYmFja3M6IEJhc2VDYWxsYmFja1tdO1xuICBxdWV1ZUxlbmd0aDogbnVtYmVyO1xuXG4gIC8vIFRPRE8oY2Fpcyk6IFdoZW4gdGhlIG5lZWQgYXJpc2VzLCB1bmNvbW1lbnQgdGhlIGZvbGxvd2luZyBsaW5lcyBhbmRcbiAgLy8gaW1wbGVtZW50IHRoZSBxdWV1ZSBmb3IgdGltZSB2YWx1ZXMuXG4gIC8vIHByaXZhdGUgZGVsdGFUQmF0Y2g6IG51bWJlcjtcbiAgLy8gcHJpdmF0ZSBkZWx0YVRzQmF0Y2hCZWdpbjogQXJyYXk8bnVtYmVyPjtcbiAgLy8gcHJpdmF0ZSBkZWx0YVRzQmF0Y2hFbmQ6IEFycmF5PG51bWJlcj47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIG9mIENhbGxiYWNrTGlzdC5cbiAgICogQHBhcmFtIGNhbGxiYWNrcyBBcnJheSBvZiBgQ2FsbGJhY2tgIGluc3RhbmNlcy5cbiAgICogQHBhcmFtIHF1ZXVlTGVuZ3RoIFF1ZXVlIGxlbmd0aCBmb3Iga2VlcGluZyBydW5uaW5nIHN0YXRpc3RpY3Mgb3ZlclxuICAgKiAgIGNhbGxiYWNrIGV4ZWN1dGlvbiB0aW1lLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY2FsbGJhY2tzPzogQmFzZUNhbGxiYWNrW10sIHF1ZXVlTGVuZ3RoID0gMTApIHtcbiAgICAvLyBUT0RPKGNhaXMpOiBNYWtlIHVzZSBvZiBxdWV1ZUxlbmd0aCB3aGVuIGltcGxlbWVudGluZyB0aGUgcXVldWUgZm9yIHRpbWVcbiAgICAvLyB2YWx1ZXMuXG4gICAgaWYgKGNhbGxiYWNrcyA9PSBudWxsKSB7XG4gICAgICBjYWxsYmFja3MgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5jYWxsYmFja3MgPSBjYWxsYmFja3M7XG4gICAgdGhpcy5xdWV1ZUxlbmd0aCA9IHF1ZXVlTGVuZ3RoO1xuICB9XG5cbiAgYXBwZW5kKGNhbGxiYWNrOiBCYXNlQ2FsbGJhY2spOiB2b2lkIHtcbiAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHNldFBhcmFtcyhwYXJhbXM6IFBhcmFtcyk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5jYWxsYmFja3MpIHtcbiAgICAgIGNhbGxiYWNrLnNldFBhcmFtcyhwYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIHNldE1vZGVsKG1vZGVsOiBDb250YWluZXIpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuY2FsbGJhY2tzKSB7XG4gICAgICBjYWxsYmFjay5zZXRNb2RlbChtb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBhdCB0aGUgc3RhcnQgb2YgYW4gZXBvY2guXG4gICAqIEBwYXJhbSBlcG9jaCBJbmRleCBvZiBlcG9jaC5cbiAgICogQHBhcmFtIGxvZ3MgRGljdGlvbmFyeSBvZiBsb2dzLlxuICAgKi9cbiAgYXN5bmMgb25FcG9jaEJlZ2luKGVwb2NoOiBudW1iZXIsIGxvZ3M/OiBVbnJlc29sdmVkTG9ncykge1xuICAgIGlmIChsb2dzID09IG51bGwpIHtcbiAgICAgIGxvZ3MgPSB7fTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBjYWxsYmFjayBvZiB0aGlzLmNhbGxiYWNrcykge1xuICAgICAgYXdhaXQgY2FsbGJhY2sub25FcG9jaEJlZ2luKGVwb2NoLCBsb2dzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGF0IHRoZSBlbmQgb2YgYW4gZXBvY2guXG4gICAqIEBwYXJhbSBlcG9jaCBJbmRleCBvZiBlcG9jaC5cbiAgICogQHBhcmFtIGxvZ3MgRGljdGlvbmFyeSBvZiBsb2dzLlxuICAgKi9cbiAgYXN5bmMgb25FcG9jaEVuZChlcG9jaDogbnVtYmVyLCBsb2dzPzogVW5yZXNvbHZlZExvZ3MpIHtcbiAgICBpZiAobG9ncyA9PSBudWxsKSB7XG4gICAgICBsb2dzID0ge307XG4gICAgfVxuICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5jYWxsYmFja3MpIHtcbiAgICAgIGF3YWl0IGNhbGxiYWNrLm9uRXBvY2hFbmQoZXBvY2gsIGxvZ3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgIHJpZ2h0IGJlZm9yZSBwcm9jZXNzaW5nIGEgYmF0Y2guXG4gICAqIEBwYXJhbSBiYXRjaCBJbmRleCBvZiBiYXRjaCB3aXRoaW4gdGhlIGN1cnJlbnQgZXBvY2guXG4gICAqIEBwYXJhbSBsb2dzIERpY3Rpb25hcnkgb2YgbG9ncy5cbiAgICovXG4gIGFzeW5jIG9uQmF0Y2hCZWdpbihiYXRjaDogbnVtYmVyLCBsb2dzPzogVW5yZXNvbHZlZExvZ3MpIHtcbiAgICBpZiAobG9ncyA9PSBudWxsKSB7XG4gICAgICBsb2dzID0ge307XG4gICAgfVxuICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5jYWxsYmFja3MpIHtcbiAgICAgIGF3YWl0IGNhbGxiYWNrLm9uQmF0Y2hCZWdpbihiYXRjaCwgbG9ncyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBhdCB0aGUgZW5kIG9mIGEgYmF0Y2guXG4gICAqIEBwYXJhbSBiYXRjaCBJbmRleCBvZiBiYXRjaCB3aXRoaW4gdGhlIGN1cnJlbnQgZXBvY2guXG4gICAqIEBwYXJhbSBsb2dzIERpY3Rpb25hcnkgb2YgbG9ncy5cbiAgICovXG4gIGFzeW5jIG9uQmF0Y2hFbmQoYmF0Y2g6IG51bWJlciwgbG9ncz86IFVucmVzb2x2ZWRMb2dzKSB7XG4gICAgaWYgKGxvZ3MgPT0gbnVsbCkge1xuICAgICAgbG9ncyA9IHt9O1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuY2FsbGJhY2tzKSB7XG4gICAgICBhd2FpdCBjYWxsYmFjay5vbkJhdGNoRW5kKGJhdGNoLCBsb2dzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgdHJhaW5pbmcuXG4gICAqIEBwYXJhbSBsb2dzIERpY3Rpb25hcnkgb2YgbG9ncy5cbiAgICovXG4gIGFzeW5jIG9uVHJhaW5CZWdpbihsb2dzPzogVW5yZXNvbHZlZExvZ3MpIHtcbiAgICBpZiAobG9ncyA9PSBudWxsKSB7XG4gICAgICBsb2dzID0ge307XG4gICAgfVxuICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5jYWxsYmFja3MpIHtcbiAgICAgIGF3YWl0IGNhbGxiYWNrLm9uVHJhaW5CZWdpbihsb2dzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGF0IHRoZSBlbmQgb2YgdHJhaW5pbmcuXG4gICAqIEBwYXJhbSBsb2dzIERpY3Rpb25hcnkgb2YgbG9ncy5cbiAgICovXG4gIGFzeW5jIG9uVHJhaW5FbmQobG9ncz86IFVucmVzb2x2ZWRMb2dzKSB7XG4gICAgaWYgKGxvZ3MgPT0gbnVsbCkge1xuICAgICAgbG9ncyA9IHt9O1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuY2FsbGJhY2tzKSB7XG4gICAgICBhd2FpdCBjYWxsYmFjay5vblRyYWluRW5kKGxvZ3MpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENhbGxiYWNrIHRoYXQgYWNjdW11bGF0ZXMgZXBvY2ggYXZlcmFnZXMgb2YgbWV0cmljcy5cbiAqXG4gKiBUaGlzIGNhbGxiYWNrIGlzIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB0byBldmVyeSBMYXllcnNNb2RlbC5cbiAqL1xuZXhwb3J0IGNsYXNzIEJhc2VMb2dnZXIgZXh0ZW5kcyBCYXNlQ2FsbGJhY2sge1xuICBwcml2YXRlIHNlZW46IG51bWJlcjtcbiAgcHJpdmF0ZSB0b3RhbHM6IFVucmVzb2x2ZWRMb2dzO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBhc3luYyBvbkVwb2NoQmVnaW4oZXBvY2g6IG51bWJlcikge1xuICAgIHRoaXMuc2VlbiA9IDA7XG4gICAgdGhpcy50b3RhbHMgPSB7fTtcbiAgfVxuXG4gIGFzeW5jIG9uQmF0Y2hFbmQoYmF0Y2g6IG51bWJlciwgbG9ncz86IFVucmVzb2x2ZWRMb2dzKSB7XG4gICAgaWYgKGxvZ3MgPT0gbnVsbCkge1xuICAgICAgbG9ncyA9IHt9O1xuICAgIH1cbiAgICBjb25zdCBiYXRjaFNpemUgPSBsb2dzWydzaXplJ10gPT0gbnVsbCA/IDAgOiBsb2dzWydzaXplJ10gYXMgbnVtYmVyO1xuICAgIHRoaXMuc2VlbiArPSBiYXRjaFNpemU7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gbG9ncykge1xuICAgICAgY29uc3QgdmFsdWUgPSBsb2dzW2tleV07XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoIXRoaXMudG90YWxzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB0aGlzLnRvdGFsc1trZXldID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvdGFsc1trZXldID0gdGhpcy50b3RhbHNba2V5XSBhcyBudW1iZXIgKyB2YWx1ZSAqIGJhdGNoU2l6ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBvbGRUb3RhbHNUb0Rpc3Bvc2U6IFNjYWxhcjtcbiAgICAgICAgaWYgKGtleSBpbiB0aGlzLnRvdGFscykge1xuICAgICAgICAgIG9sZFRvdGFsc1RvRGlzcG9zZSA9IHRoaXMudG90YWxzW2tleV0gYXMgU2NhbGFyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudG90YWxzW2tleV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRvdGFsOiBTY2FsYXIgPVxuICAgICAgICAgICAgdGlkeSgoKSA9PiBhZGQoKHRoaXMudG90YWxzW2tleV0pLCBtdWwodmFsdWUsIGJhdGNoU2l6ZSkpKTtcbiAgICAgICAgdGhpcy50b3RhbHNba2V5XSA9IHRvdGFsO1xuICAgICAgICBpZiAob2xkVG90YWxzVG9EaXNwb3NlICE9IG51bGwpIHtcbiAgICAgICAgICBvbGRUb3RhbHNUb0Rpc3Bvc2UuZGlzcG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgb25FcG9jaEVuZChlcG9jaDogbnVtYmVyLCBsb2dzPzogVW5yZXNvbHZlZExvZ3MpIHtcbiAgICBpZiAobG9ncyAhPSBudWxsKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLnBhcmFtc1snbWV0cmljcyddIGFzIHN0cmluZ1tdKSB7XG4gICAgICAgIGlmICh0aGlzLnRvdGFsc1trZXldID09IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRoaXMudG90YWxzW2tleV0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgbG9nc1trZXldID0gdGhpcy50b3RhbHNba2V5XSBhcyBudW1iZXIgLyB0aGlzLnNlZW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGlkeSgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb2c6IFNjYWxhciA9IG11bChkaXYoMSwgdGhpcy5zZWVuKSwgdGhpcy50b3RhbHNba2V5XSk7XG4gICAgICAgICAgICBsb2dzW2tleV0gPSBsb2c7XG4gICAgICAgICAgICAodGhpcy50b3RhbHNba2V5XSBhcyBUZW5zb3IpLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgIGtlZXAobG9nc1trZXldIGFzIFNjYWxhcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDYWxsYmFjayB0aGF0IHJlY29yZHMgZXZlbnRzIGludG8gYSBgSGlzdG9yeWAgb2JqZWN0LiBUaGlzIGNhbGxiYWNrIGlzXG4gKiBhdXRvbWF0aWNhbGx5IGFwcGxpZWQgdG8gZXZlcnkgVEYuanMgTGF5ZXJzIG1vZGVsLiBUaGUgYEhpc3RvcnlgIG9iamVjdFxuICogZ2V0cyByZXR1cm5lZCBieSB0aGUgYGZpdGAgbWV0aG9kIG9mIG1vZGVscy5cbiAqL1xuZXhwb3J0IGNsYXNzIEhpc3RvcnkgZXh0ZW5kcyBCYXNlQ2FsbGJhY2sge1xuICBlcG9jaDogbnVtYmVyW107XG4gIGhpc3Rvcnk6IHtba2V5OiBzdHJpbmddOiBBcnJheTxudW1iZXJ8VGVuc29yPn07XG5cbiAgYXN5bmMgb25UcmFpbkJlZ2luKGxvZ3M/OiBVbnJlc29sdmVkTG9ncykge1xuICAgIHRoaXMuZXBvY2ggPSBbXTtcbiAgICB0aGlzLmhpc3RvcnkgPSB7fTtcbiAgfVxuXG4gIGFzeW5jIG9uRXBvY2hFbmQoZXBvY2g6IG51bWJlciwgbG9ncz86IFVucmVzb2x2ZWRMb2dzKSB7XG4gICAgaWYgKGxvZ3MgPT0gbnVsbCkge1xuICAgICAgbG9ncyA9IHt9O1xuICAgIH1cbiAgICB0aGlzLmVwb2NoLnB1c2goZXBvY2gpO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGxvZ3MpIHtcbiAgICAgIGlmICh0aGlzLmhpc3Rvcnlba2V5XSA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuaGlzdG9yeVtrZXldID0gW107XG4gICAgICB9XG4gICAgICB0aGlzLmhpc3Rvcnlba2V5XS5wdXNoKGxvZ3Nba2V5XSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF3YWl0IHRoZSB2YWx1ZXMgb2YgYWxsIGxvc3NlcyBhbmQgbWV0cmljcy5cbiAgICovXG4gIGFzeW5jIHN5bmNEYXRhKCkge1xuICAgIGNvbnN0IHByb21pc2VzOiBBcnJheTxQcm9taXNlPEZsb2F0MzJBcnJheXxJbnQzMkFycmF5fFVpbnQ4QXJyYXk+PiA9IFtdO1xuICAgIGNvbnN0IGtleXM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgaW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLmhpc3RvcnkpIHtcbiAgICAgIGNvbnN0IHZhbHVlQXJyYXkgPSB0aGlzLmhpc3Rvcnlba2V5XTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVBcnJheS5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlQXJyYXlbaV0gIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWVTY2FsYXIgPSB2YWx1ZUFycmF5W2ldIGFzIFRlbnNvcjtcbiAgICAgICAgICBwcm9taXNlcy5wdXNoKHZhbHVlU2NhbGFyLmRhdGEoKSk7XG4gICAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgaW5kaWNlcy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlcyA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBmb3IgKGxldCBuID0gMDsgbiA8IHZhbHVlcy5sZW5ndGg7ICsrbikge1xuICAgICAgY29uc3QgdGVuc29yVG9EaXNwb3NlID0gdGhpcy5oaXN0b3J5W2tleXNbbl1dW2luZGljZXNbbl1dIGFzIFRlbnNvcjtcbiAgICAgIHRlbnNvclRvRGlzcG9zZS5kaXNwb3NlKCk7XG4gICAgICB0aGlzLmhpc3Rvcnlba2V5c1tuXV1baW5kaWNlc1tuXV0gPSB2YWx1ZXNbbl1bMF07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tQ2FsbGJhY2tBcmdzIHtcbiAgb25UcmFpbkJlZ2luPzogKGxvZ3M/OiBMb2dzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPjtcbiAgb25UcmFpbkVuZD86IChsb2dzPzogTG9ncykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD47XG4gIG9uRXBvY2hCZWdpbj86IChlcG9jaDogbnVtYmVyLCBsb2dzPzogTG9ncykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD47XG4gIG9uRXBvY2hFbmQ/OiAoZXBvY2g6IG51bWJlciwgbG9ncz86IExvZ3MpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+O1xuICBvbkJhdGNoQmVnaW4/OiAoYmF0Y2g6IG51bWJlciwgbG9ncz86IExvZ3MpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+O1xuICBvbkJhdGNoRW5kPzogKGJhdGNoOiBudW1iZXIsIGxvZ3M/OiBMb2dzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPjtcbiAgb25ZaWVsZD86IChlcG9jaDogbnVtYmVyLCBiYXRjaDogbnVtYmVyLCBsb2dzOiBMb2dzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPjtcbiAgLy8gVXNlZCBmb3IgdGVzdCBESSBtb2NraW5nLlxuICBub3dGdW5jPzogRnVuY3Rpb247XG4gIG5leHRGcmFtZUZ1bmM/OiBGdW5jdGlvbjtcbn1cblxuLyoqXG4gKiBDdXN0b20gY2FsbGJhY2sgZm9yIHRyYWluaW5nLlxuICovXG5leHBvcnQgY2xhc3MgQ3VzdG9tQ2FsbGJhY2sgZXh0ZW5kcyBCYXNlQ2FsbGJhY2sge1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgdHJhaW5CZWdpbjogKGxvZ3M/OiBMb2dzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPjtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHRyYWluRW5kOiAobG9ncz86IExvZ3MpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+O1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZXBvY2hCZWdpbjpcbiAgICAgIChlcG9jaDogbnVtYmVyLCBsb2dzPzogTG9ncykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD47XG4gIHByb3RlY3RlZCByZWFkb25seSBlcG9jaEVuZDpcbiAgICAgIChlcG9jaDogbnVtYmVyLCBsb2dzPzogTG9ncykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD47XG4gIHByb3RlY3RlZCByZWFkb25seSBiYXRjaEJlZ2luOlxuICAgICAgKGJhdGNoOiBudW1iZXIsIGxvZ3M/OiBMb2dzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPjtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGJhdGNoRW5kOlxuICAgICAgKGJhdGNoOiBudW1iZXIsIGxvZ3M/OiBMb2dzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPjtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHlpZWxkOlxuICAgICAgKGVwb2NoOiBudW1iZXIsIGJhdGNoOiBudW1iZXIsIGxvZ3M6IExvZ3MpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+O1xuXG4gIHByaXZhdGUgeWllbGRFdmVyeTogWWllbGRFdmVyeU9wdGlvbnM7XG4gIHByaXZhdGUgY3VycmVudEVwb2NoID0gMDtcbiAgcHVibGljIG5vd0Z1bmM6IEZ1bmN0aW9uO1xuICBwdWJsaWMgbmV4dEZyYW1lRnVuYzogRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3IoYXJnczogQ3VzdG9tQ2FsbGJhY2tBcmdzLCB5aWVsZEV2ZXJ5PzogWWllbGRFdmVyeU9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubm93RnVuYyA9IGFyZ3Mubm93RnVuYztcbiAgICB0aGlzLm5leHRGcmFtZUZ1bmMgPSBhcmdzLm5leHRGcmFtZUZ1bmMgfHwgbmV4dEZyYW1lO1xuICAgIHRoaXMueWllbGRFdmVyeSA9IHlpZWxkRXZlcnkgfHwgJ2F1dG8nO1xuICAgIGlmICh0aGlzLnlpZWxkRXZlcnkgPT09ICdhdXRvJykge1xuICAgICAgdGhpcy55aWVsZEV2ZXJ5ID0gREVGQVVMVF9ZSUVMRF9FVkVSWV9NUztcbiAgICB9XG4gICAgaWYgKHRoaXMueWllbGRFdmVyeSA9PT0gJ25ldmVyJyAmJiBhcmdzLm9uWWllbGQgIT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICd5aWVsZEV2ZXJ5IGlzIGBuZXZlcmAgYnV0IHlvdSBwcm92aWRlZCBhbiBgb25ZaWVsZGAgY2FsbGJhY2suICcgK1xuICAgICAgICAgICdFaXRoZXIgY2hhbmdlIGB5aWVsZEV2ZXJ5YCBvciByZW1vdmUgdGhlIGNhbGxiYWNrJyk7XG4gICAgfVxuICAgIGlmICh1dGlsLmlzTnVtYmVyKHRoaXMueWllbGRFdmVyeSkpIHtcbiAgICAgIC8vIERlY29yYXRlIGBtYXliZVdhaXRgIHNvIGl0IHdpbGwgYmUgY2FsbGVkIGF0IG1vc3Qgb25jZSBldmVyeVxuICAgICAgLy8gYHlpZWxkRXZlcnlgIG1zLlxuICAgICAgdGhpcy5tYXliZVdhaXQgPSBnZW5lcmljX3V0aWxzLmRlYm91bmNlKFxuICAgICAgICAgIHRoaXMubWF5YmVXYWl0LmJpbmQodGhpcyksIHRoaXMueWllbGRFdmVyeSBhcyBudW1iZXIsIHRoaXMubm93RnVuYyk7XG4gICAgfVxuICAgIHRoaXMudHJhaW5CZWdpbiA9IGFyZ3Mub25UcmFpbkJlZ2luO1xuICAgIHRoaXMudHJhaW5FbmQgPSBhcmdzLm9uVHJhaW5FbmQ7XG4gICAgdGhpcy5lcG9jaEJlZ2luID0gYXJncy5vbkVwb2NoQmVnaW47XG4gICAgdGhpcy5lcG9jaEVuZCA9IGFyZ3Mub25FcG9jaEVuZDtcbiAgICB0aGlzLmJhdGNoQmVnaW4gPSBhcmdzLm9uQmF0Y2hCZWdpbjtcbiAgICB0aGlzLmJhdGNoRW5kID0gYXJncy5vbkJhdGNoRW5kO1xuICAgIHRoaXMueWllbGQgPSBhcmdzLm9uWWllbGQ7XG4gIH1cblxuICBhc3luYyBtYXliZVdhaXQoZXBvY2g6IG51bWJlciwgYmF0Y2g6IG51bWJlciwgbG9nczogVW5yZXNvbHZlZExvZ3MpIHtcbiAgICBjb25zdCBwczogQXJyYXk8dm9pZHxQcm9taXNlPHZvaWQ+PiA9IFtdO1xuICAgIGlmICh0aGlzLnlpZWxkICE9IG51bGwpIHtcbiAgICAgIGF3YWl0IHJlc29sdmVTY2FsYXJzSW5Mb2dzKGxvZ3MpO1xuICAgICAgcHMucHVzaCh0aGlzLnlpZWxkKGVwb2NoLCBiYXRjaCwgbG9ncyBhcyBMb2dzKSk7XG4gICAgfVxuICAgIHBzLnB1c2godGhpcy5uZXh0RnJhbWVGdW5jKCkpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHBzKTtcbiAgfVxuXG4gIGFzeW5jIG9uRXBvY2hCZWdpbihlcG9jaDogbnVtYmVyLCBsb2dzPzogVW5yZXNvbHZlZExvZ3MpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmN1cnJlbnRFcG9jaCA9IGVwb2NoO1xuICAgIGlmICh0aGlzLmVwb2NoQmVnaW4gIT0gbnVsbCkge1xuICAgICAgYXdhaXQgcmVzb2x2ZVNjYWxhcnNJbkxvZ3MobG9ncyk7XG4gICAgICBhd2FpdCB0aGlzLmVwb2NoQmVnaW4oZXBvY2gsIGxvZ3MgYXMgTG9ncyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgb25FcG9jaEVuZChlcG9jaDogbnVtYmVyLCBsb2dzPzogVW5yZXNvbHZlZExvZ3MpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwczogQXJyYXk8dm9pZHxQcm9taXNlPHZvaWQ+PiA9IFtdO1xuICAgIGlmICh0aGlzLmVwb2NoRW5kICE9IG51bGwpIHtcbiAgICAgIGF3YWl0IHJlc29sdmVTY2FsYXJzSW5Mb2dzKGxvZ3MpO1xuICAgICAgcHMucHVzaCh0aGlzLmVwb2NoRW5kKGVwb2NoLCBsb2dzIGFzIExvZ3MpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMueWllbGRFdmVyeSA9PT0gJ2Vwb2NoJykge1xuICAgICAgcHMucHVzaCh0aGlzLm5leHRGcmFtZUZ1bmMoKSk7XG4gICAgfVxuICAgIGF3YWl0IFByb21pc2UuYWxsKHBzKTtcbiAgfVxuXG4gIGFzeW5jIG9uQmF0Y2hCZWdpbihiYXRjaDogbnVtYmVyLCBsb2dzPzogVW5yZXNvbHZlZExvZ3MpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5iYXRjaEJlZ2luICE9IG51bGwpIHtcbiAgICAgIGF3YWl0IHJlc29sdmVTY2FsYXJzSW5Mb2dzKGxvZ3MpO1xuICAgICAgYXdhaXQgdGhpcy5iYXRjaEJlZ2luKGJhdGNoLCBsb2dzIGFzIExvZ3MpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9uQmF0Y2hFbmQoYmF0Y2g6IG51bWJlciwgbG9ncz86IFVucmVzb2x2ZWRMb2dzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcHM6IEFycmF5PHZvaWR8UHJvbWlzZTx2b2lkPj4gPSBbXTtcbiAgICBpZiAodGhpcy5iYXRjaEVuZCAhPSBudWxsKSB7XG4gICAgICBhd2FpdCByZXNvbHZlU2NhbGFyc0luTG9ncyhsb2dzKTtcbiAgICAgIHBzLnB1c2godGhpcy5iYXRjaEVuZChiYXRjaCwgbG9ncyBhcyBMb2dzKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnlpZWxkRXZlcnkgPT09ICdiYXRjaCcpIHtcbiAgICAgIHBzLnB1c2godGhpcy5uZXh0RnJhbWVGdW5jKCkpO1xuICAgIH0gZWxzZSBpZiAodXRpbC5pc051bWJlcih0aGlzLnlpZWxkRXZlcnkpKSB7XG4gICAgICBwcy5wdXNoKHRoaXMubWF5YmVXYWl0KHRoaXMuY3VycmVudEVwb2NoLCBiYXRjaCwgbG9ncykpO1xuICAgIH1cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcyk7XG4gIH1cblxuICBhc3luYyBvblRyYWluQmVnaW4obG9ncz86IFVucmVzb2x2ZWRMb2dzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMudHJhaW5CZWdpbiAhPSBudWxsKSB7XG4gICAgICBhd2FpdCByZXNvbHZlU2NhbGFyc0luTG9ncyhsb2dzKTtcbiAgICAgIGF3YWl0IHRoaXMudHJhaW5CZWdpbihsb2dzIGFzIExvZ3MpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9uVHJhaW5FbmQobG9ncz86IFVucmVzb2x2ZWRMb2dzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMudHJhaW5FbmQgIT0gbnVsbCkge1xuICAgICAgYXdhaXQgcmVzb2x2ZVNjYWxhcnNJbkxvZ3MobG9ncyk7XG4gICAgICBhd2FpdCB0aGlzLnRyYWluRW5kKGxvZ3MgYXMgTG9ncyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU3RhbmRhcmRpemUgY2FsbGJhY2tzIG9yIGNvbmZpZ3VyYXRpb25zIG9mIHRoZW0gdG8gYW4gQXJyYXkgb2YgY2FsbGJhY2tzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhbmRhcmRpemVDYWxsYmFja3MoXG4gICAgY2FsbGJhY2tzOiBCYXNlQ2FsbGJhY2t8QmFzZUNhbGxiYWNrW118Q3VzdG9tQ2FsbGJhY2tBcmdzfFxuICAgIEN1c3RvbUNhbGxiYWNrQXJnc1tdLFxuICAgIHlpZWxkRXZlcnk6IFlpZWxkRXZlcnlPcHRpb25zKTogQmFzZUNhbGxiYWNrW10ge1xuICBpZiAoY2FsbGJhY2tzID09IG51bGwpIHtcbiAgICBjYWxsYmFja3MgPSB7fSBhcyBCYXNlQ2FsbGJhY2s7XG4gIH1cbiAgaWYgKGNhbGxiYWNrcyBpbnN0YW5jZW9mIEJhc2VDYWxsYmFjaykge1xuICAgIHJldHVybiBbY2FsbGJhY2tzXTtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShjYWxsYmFja3MpICYmIGNhbGxiYWNrc1swXSBpbnN0YW5jZW9mIEJhc2VDYWxsYmFjaykge1xuICAgIHJldHVybiBjYWxsYmFja3MgYXMgQmFzZUNhbGxiYWNrW107XG4gIH1cbiAgLy8gQ29udmVydCBjdXN0b20gY2FsbGJhY2sgY29uZmlncyB0byBjdXN0b20gY2FsbGJhY2sgb2JqZWN0cy5cbiAgY29uc3QgY2FsbGJhY2tDb25maWdzID1cbiAgICAgIGdlbmVyaWNfdXRpbHMudG9MaXN0KGNhbGxiYWNrcykgYXMgQ3VzdG9tQ2FsbGJhY2tBcmdzW107XG4gIHJldHVybiBjYWxsYmFja0NvbmZpZ3MubWFwKFxuICAgICAgY2FsbGJhY2tDb25maWcgPT4gbmV3IEN1c3RvbUNhbGxiYWNrKGNhbGxiYWNrQ29uZmlnLCB5aWVsZEV2ZXJ5KSk7XG59XG5cbmV4cG9ydCBkZWNsYXJlIHR5cGUgQmFzZUNhbGxiYWNrQ29uc3RydWN0b3IgPSB7XG4gIG5ldyAoKTogQmFzZUNhbGxiYWNrXG59O1xuXG4vKipcbiAqIEEgZ2xvYmFsIHJlZ2lzdHJ5IGZvciBjYWxsYmFjayBjb25zdHJ1Y3RvcnMgdG8gYmUgdXNlZCBkdXJpbmdcbiAqIExheWVyc01vZGVsLmZpdCgpLlxuICovXG5leHBvcnQgY2xhc3MgQ2FsbGJhY2tDb25zdHJ1Y3RvclJlZ2lzdHJ5IHtcbiAgcHJpdmF0ZSBzdGF0aWMgY29uc3RydWN0b3JzOlxuICAgICAge1t2ZXJib3NpdHlMZXZlbDogbnVtYmVyXTogQmFzZUNhbGxiYWNrQ29uc3RydWN0b3JbXX0gPSB7fTtcblxuICAvKipcbiAgICogQmxvY2tzIHB1YmxpYyBhY2Nlc3MgdG8gY29uc3RydWN0b3IuXG4gICAqL1xuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSB0Zi5MYXllcnNNb2RlbC5maXQoKSBjYWxsYmFjayBjb25zdHJ1Y3Rvci5cbiAgICpcbiAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgY29uc3RydWN0b3Igd2lsbCBiZSB1c2VkIHRvIGluc3RhbnRpYXRlXG4gICAqIGNhbGxiYWNrcyBmb3IgZXZlcnkgdGYuTGF5ZXJzTW9kZWwuZml0KCkgY2FsbCBhZnRlcndhcmRzLlxuICAgKlxuICAgKiBAcGFyYW0gdmVyYm9zaXR5TGV2ZWwgTGV2ZWwgb2YgdmVyYm9zaXR5IGF0IHdoaWNoIHRoZSBgY2FsbGJhY2tDb25zdHJ1Y3RvcmBcbiAgICogICBpcyB0byBiZSByZWlnc3RlcmVkLlxuICAgKiBAcGFyYW0gY2FsbGJhY2tDb25zdHJ1Y3RvciBBIG5vLWFyZyBjb25zdHJ1Y3RvciBmb3IgYHRmLkNhbGxiYWNrYC5cbiAgICogQHRocm93cyBFcnJvciwgaWYgdGhlIHNhbWUgY2FsbGJhY2tDb25zdHJ1Y3RvciBoYXMgYmVlbiByZWdpc3RlcmVkIGJlZm9yZSxcbiAgICogICBlaXRoZXIgYXQgdGhlIHNhbWUgb3IgYSBkaWZmZXJlbnQgYHZlcmJvc2l0eUxldmVsYC5cbiAgICovXG4gIHN0YXRpYyByZWdpc3RlckNhbGxiYWNrQ29uc3RydWN0b3IoXG4gICAgICB2ZXJib3NpdHlMZXZlbDogbnVtYmVyLCBjYWxsYmFja0NvbnN0cnVjdG9yOiBCYXNlQ2FsbGJhY2tDb25zdHJ1Y3Rvcikge1xuICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICB2ZXJib3NpdHlMZXZlbCA+PSAwICYmIE51bWJlci5pc0ludGVnZXIodmVyYm9zaXR5TGV2ZWwpLFxuICAgICAgICAoKSA9PiBgVmVyYm9zaXR5IGxldmVsIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGludGVnZXIgPj0gMCwgYCArXG4gICAgICAgICAgICBgYnV0IGdvdCAke3ZlcmJvc2l0eUxldmVsfWApO1xuICAgIENhbGxiYWNrQ29uc3RydWN0b3JSZWdpc3RyeS5jaGVja0ZvckR1cGxpY2F0ZShjYWxsYmFja0NvbnN0cnVjdG9yKTtcbiAgICBpZiAoQ2FsbGJhY2tDb25zdHJ1Y3RvclJlZ2lzdHJ5LmNvbnN0cnVjdG9yc1t2ZXJib3NpdHlMZXZlbF0gPT0gbnVsbCkge1xuICAgICAgQ2FsbGJhY2tDb25zdHJ1Y3RvclJlZ2lzdHJ5LmNvbnN0cnVjdG9yc1t2ZXJib3NpdHlMZXZlbF0gPSBbXTtcbiAgICB9XG4gICAgQ2FsbGJhY2tDb25zdHJ1Y3RvclJlZ2lzdHJ5LmNvbnN0cnVjdG9yc1t2ZXJib3NpdHlMZXZlbF0ucHVzaChcbiAgICAgICAgY2FsbGJhY2tDb25zdHJ1Y3Rvcik7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjaGVja0ZvckR1cGxpY2F0ZShjYWxsYmFja0NvbnN0cnVjdG9yOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQmFzZUNhbGxiYWNrQ29uc3RydWN0b3IpIHtcbiAgICBmb3IgKGNvbnN0IGxldmVsTmFtZSBpbiBDYWxsYmFja0NvbnN0cnVjdG9yUmVnaXN0cnkuY29uc3RydWN0b3JzKSB7XG4gICAgICBjb25zdCBjb25zdHJ1Y3RvcnMgPSBDYWxsYmFja0NvbnN0cnVjdG9yUmVnaXN0cnkuY29uc3RydWN0b3JzWytsZXZlbE5hbWVdO1xuICAgICAgY29uc3RydWN0b3JzLmZvckVhY2goY3RvciA9PiB7XG4gICAgICAgIGlmIChjdG9yID09PSBjYWxsYmFja0NvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoJ0R1cGxpY2F0ZSBjYWxsYmFjayBjb25zdHJ1Y3Rvci4nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIGFsbCByZWdpc3RlcmVkIGNhbGxiYWNrIGNvbnN0cnVjdG9ycy5cbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgY2xlYXIoKSB7XG4gICAgQ2FsbGJhY2tDb25zdHJ1Y3RvclJlZ2lzdHJ5LmNvbnN0cnVjdG9ycyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBjYWxsYmFja3MgdXNpbmcgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgY29uc3RydWN0b3JzLlxuICAgKlxuICAgKiBHaXZlbiBgdmVyYm9zaXR5TGV2ZWxgLCBhbGwgY29uc3RydWN0b3JzIHJlZ2lzdGVyZWQgYXQgdGhhdCBsZXZlbCBvciBhYm92ZVxuICAgKiB3aWxsIGJlIGNhbGxlZCBhbmQgdGhlIGluc3RhbnRpYXRlZCBjYWxsYmFja3Mgd2lsbCBiZSB1c2VkLlxuICAgKlxuICAgKiBAcGFyYW0gdmVyYm9zaXR5TGV2ZWw6IExldmVsIG9mIHZlcmJvc2l0eS5cbiAgICovXG4gIHN0YXRpYyBjcmVhdGVDYWxsYmFja3ModmVyYm9zaXR5TGV2ZWw6IG51bWJlcik6IEJhc2VDYWxsYmFja1tdIHtcbiAgICBjb25zdCBjb25zdHJ1Y3RvcnM6IEJhc2VDYWxsYmFja0NvbnN0cnVjdG9yW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGxldmVsTmFtZSBpbiBDYWxsYmFja0NvbnN0cnVjdG9yUmVnaXN0cnkuY29uc3RydWN0b3JzKSB7XG4gICAgICBjb25zdCBsZXZlbCA9ICtsZXZlbE5hbWU7XG4gICAgICBpZiAodmVyYm9zaXR5TGV2ZWwgPj0gbGV2ZWwpIHtcbiAgICAgICAgY29uc3RydWN0b3JzLnB1c2goLi4uQ2FsbGJhY2tDb25zdHJ1Y3RvclJlZ2lzdHJ5LmNvbnN0cnVjdG9yc1tsZXZlbF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29uc3RydWN0b3JzLm1hcChjdG9yID0+IG5ldyBjdG9yKCkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25maWd1cmVDYWxsYmFja3MoXG4gICAgY2FsbGJhY2tzOiBCYXNlQ2FsbGJhY2tbXSwgdmVyYm9zZTogTW9kZWxMb2dnaW5nVmVyYm9zaXR5LCBlcG9jaHM6IG51bWJlcixcbiAgICBpbml0aWFsRXBvY2g6IG51bWJlciwgbnVtVHJhaW5TYW1wbGVzOiBudW1iZXIsIHN0ZXBzUGVyRXBvY2g6IG51bWJlcixcbiAgICBiYXRjaFNpemU6IG51bWJlciwgZG9WYWxpZGF0aW9uOiBib29sZWFuLFxuICAgIGNhbGxiYWNrTWV0cmljczogc3RyaW5nW10pOiB7Y2FsbGJhY2tMaXN0OiBDYWxsYmFja0xpc3QsIGhpc3Rvcnk6IEhpc3Rvcnl9IHtcbiAgY29uc3QgaGlzdG9yeSA9IG5ldyBIaXN0b3J5KCk7XG4gIGNvbnN0IGFjdHVhbENhbGxiYWNrczogQmFzZUNhbGxiYWNrW10gPSBbXG4gICAgbmV3IEJhc2VMb2dnZXIoKSwgLi4uQ2FsbGJhY2tDb25zdHJ1Y3RvclJlZ2lzdHJ5LmNyZWF0ZUNhbGxiYWNrcyh2ZXJib3NlKVxuICBdO1xuICBpZiAoY2FsbGJhY2tzICE9IG51bGwpIHtcbiAgICBhY3R1YWxDYWxsYmFja3MucHVzaCguLi5jYWxsYmFja3MpO1xuICB9XG4gIGFjdHVhbENhbGxiYWNrcy5wdXNoKGhpc3RvcnkpO1xuICBjb25zdCBjYWxsYmFja0xpc3QgPSBuZXcgQ2FsbGJhY2tMaXN0KGFjdHVhbENhbGxiYWNrcyk7XG5cbiAgLy8gVE9ETyhjYWlzKTogRmlndXJlIG91dCB3aGVuIHRoaXMgTGF5ZXJzTW9kZWwgaW5zdGFuY2UgY2FuIGhhdmUgYVxuICAvLyBkeW5hbWljYWxseVxuICAvLyAgIHNldCBwcm9wZXJ0eSBjYWxsZWQgJ2NhbGxiYWNrX21vZGVsJyBhcyBpbiBQeUtlcmFzLlxuXG4gIGNhbGxiYWNrTGlzdC5zZXRQYXJhbXMoe1xuICAgIGVwb2NocyxcbiAgICBpbml0aWFsRXBvY2gsXG4gICAgc2FtcGxlczogbnVtVHJhaW5TYW1wbGVzLFxuICAgIHN0ZXBzOiBzdGVwc1BlckVwb2NoLFxuICAgIGJhdGNoU2l6ZSxcbiAgICB2ZXJib3NlLFxuICAgIGRvVmFsaWRhdGlvbixcbiAgICBtZXRyaWNzOiBjYWxsYmFja01ldHJpY3MsXG4gIH0pO1xuICByZXR1cm4ge2NhbGxiYWNrTGlzdCwgaGlzdG9yeX07XG59XG4iXX0=