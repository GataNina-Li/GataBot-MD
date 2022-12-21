"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kFieldCount = exports.kResponseCountField = exports.kRequestCountField = exports.isTaskQueue = exports.markMovable = exports.isMovable = exports.isTransferable = exports.kQueueOptions = exports.kValue = exports.kTransferable = exports.commonState = void 0;
;
exports.commonState = {
    isWorkerThread: false,
    workerData: undefined
};
// Internal symbol used to mark Transferable objects returned
// by the Piscina.move() function
const kMovable = Symbol('Piscina.kMovable');
exports.kTransferable = Symbol.for('Piscina.transferable');
exports.kValue = Symbol.for('Piscina.valueOf');
exports.kQueueOptions = Symbol.for('Piscina.queueOptions');
// True if the object implements the Transferable interface
function isTransferable(value) {
    return value != null &&
        typeof value === 'object' &&
        exports.kTransferable in value &&
        exports.kValue in value;
}
exports.isTransferable = isTransferable;
// True if object implements Transferable and has been returned
// by the Piscina.move() function
function isMovable(value) {
    return isTransferable(value) && value[kMovable] === true;
}
exports.isMovable = isMovable;
function markMovable(value) {
    Object.defineProperty(value, kMovable, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: true
    });
}
exports.markMovable = markMovable;
function isTaskQueue(value) {
    return typeof value === 'object' &&
        value !== null &&
        'size' in value &&
        typeof value.shift === 'function' &&
        typeof value.remove === 'function' &&
        typeof value.push === 'function';
}
exports.isTaskQueue = isTaskQueue;
exports.kRequestCountField = 0;
exports.kResponseCountField = 1;
exports.kFieldCount = 2;
//# sourceMappingURL=common.js.map