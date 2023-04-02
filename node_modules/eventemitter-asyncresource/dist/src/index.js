"use strict";
const events_1 = require("events");
const async_hooks_1 = require("async_hooks");
const kEventEmitter = Symbol('kEventEmitter');
const kAsyncResource = Symbol('kAsyncResource');
class EventEmitterReferencingAsyncResource extends async_hooks_1.AsyncResource {
    constructor(ee, type, options) {
        super(type, options);
        this[kEventEmitter] = ee;
    }
    get eventEmitter() {
        return this[kEventEmitter];
    }
}
class EventEmitterAsyncResource extends events_1.EventEmitter {
    constructor(options) {
        let name;
        if (typeof options === 'string') {
            name = options;
            options = undefined;
        }
        else {
            name = (options === null || options === void 0 ? void 0 : options.name) || new.target.name;
        }
        super(options);
        this[kAsyncResource] =
            new EventEmitterReferencingAsyncResource(this, name, options);
    }
    emit(event, ...args) {
        return this.asyncResource.runInAsyncScope(super.emit, this, event, ...args);
    }
    emitDestroy() {
        this.asyncResource.emitDestroy();
    }
    asyncId() {
        return this.asyncResource.asyncId();
    }
    triggerAsyncId() {
        return this.asyncResource.triggerAsyncId();
    }
    get asyncResource() {
        return this[kAsyncResource];
    }
    static get EventEmitterAsyncResource() { return EventEmitterAsyncResource; }
}
module.exports = EventEmitterAsyncResource;
//# sourceMappingURL=index.js.map