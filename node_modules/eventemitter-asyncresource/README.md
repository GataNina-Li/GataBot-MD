# eventemitter-asyncresource - AsyncResource integration for EventEmitter

Integrates [`EventEmitter`][] with [`AsyncResource`][] for `EventEmitter`s that
require manual async tracking.

```js
const { EventEmitterAsyncResource } = require('eventemitter-asyncresource');

// Async tracking tooling will identify this as 'Q'.
const ee = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo' listeners will run in this EventEmitter’s async context.P
ee.emit('foo');
```

The `EventEmitterAsyncResource` class has the same methods and takes the same
options as `EventEmitter` and `AsyncResource` themselves.

It provides an `.asyncResource` property that allows accessing the async
resource in question, which in turn provides the original `EventEmitter` via
`.eventEmitter`, i.e. in the above example
`ee.asyncResource.eventEmitter === ee`.

[`EventEmitter`]: https://nodejs.org/api/events.html#events_class_eventemitter
[`AsyncResource`]: https://nodejs.org/api/async_hooks.html#async_hooks_class_asyncresource
