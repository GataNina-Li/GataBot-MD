'use strict';
const assert = require('assert');
const nice = require('./');

assert.strictEqual(nice.nice, nice);

const cur = nice(0);
assert.strictEqual(cur + 1, nice(1));
assert.strictEqual(cur + 1, nice(0));

if (+process.version.split('.')[0].slice(1) >= 12 && process.platform === 'linux') {
  let messages = 0;
  const { Worker } = require('worker_threads');
  const w = new Worker(`require("worker_threads").parentPort.postMessage(
    require("./")(1))`, { eval: true });
  w.on('message', (m) => {
    messages++;
    assert.strictEqual(cur + 1, nice(0));
    assert.strictEqual(cur + 2, m);
  });
  w.on('exit', () => {
    assert.strictEqual(messages, 1);
    assert.strictEqual(cur + 1, nice(0));
    test2();
  });
} else {
  test2();
}

function test2() {
  nice(10000);
  assert.strictEqual(nice(0), nice(10000));

  if (process.getuid() !== 0) {
    assert.throws(() => nice(-1), /nice\(\): Operation not permitted/);
  }
}
