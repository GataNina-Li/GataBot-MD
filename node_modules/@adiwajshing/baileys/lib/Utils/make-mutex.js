"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeKeyedMutex = exports.makeMutex = void 0;
const logger_1 = __importDefault(require("./logger"));
const MUTEX_TIMEOUT_MS = 60000;
const makeMutex = () => {
    let task = Promise.resolve();
    let taskTimeout;
    return {
        mutex(code) {
            task = (async () => {
                const stack = new Error('mutex start').stack;
                let waitOver = false;
                taskTimeout = setTimeout(() => {
                    logger_1.default.warn({ stack, waitOver }, 'possible mutex deadlock');
                }, MUTEX_TIMEOUT_MS);
                // wait for the previous task to complete
                // if there is an error, we swallow so as to not block the queue
                try {
                    await task;
                }
                catch (_a) { }
                waitOver = true;
                try {
                    // execute the current task
                    const result = await code();
                    return result;
                }
                finally {
                    clearTimeout(taskTimeout);
                }
            })();
            // we replace the existing task, appending the new piece of execution to it
            // so the next task will have to wait for this one to finish
            return task;
        },
    };
};
exports.makeMutex = makeMutex;
const makeKeyedMutex = () => {
    const map = {};
    return {
        mutex(key, task) {
            if (!map[key]) {
                map[key] = (0, exports.makeMutex)();
            }
            return map[key].mutex(task);
        }
    };
};
exports.makeKeyedMutex = makeKeyedMutex;
