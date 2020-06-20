## Implementing a Readable Stream

To implement a `Readable` stream, you need to construct an object, or inherit,
from `stream.Readable` class and implement a `_read()` method in it.

```js
const { Readable } = require('stream')

const myStream = new Readable({})
myStream._read = () => {}
```

or

```js
const { Readable } = require('stream')

class MyStream extends Readable {
  _read() {}
}
```

Note: This `_read` method MUST NOT be called by application code directly.
It should be called by the internal `Readable` class methods only.

### Reading modes

`Readable` streams operate in one of two modes: flowing and paused

* In flowing mode, data is read from the underlying system automatically and
  provided as quickly as possible.

* In paused mode, the `read()` method must be called explicitly to read chunks
  of data from the stream.

All Readable streams begin in paused mode but can be switched to flowing mode,
and also can switch back to paused mode.

### Consuming a Readable Stream

* `readable.pipe(writable)`, attaching `Writable` stream to the readable, cause
  it to switch automatically into flowing mode and push all of its data to the
  attached `Writable`.

* `readable.on('readable', ...)`, here the stream (`readable`) is in paused mode
  and have to use the `read(size)` method for start consuming the data.

* `readable.on('data', ...)`, adding the `data` event handler switch the stream
  to a flowing mode. We can pause and resume the stream by using `pause()`
  and `resume()` methods respectively. This is useful when you need to do some
  time-consuming action with the stream's data (such as writing to a database)

### Adding data to stream

You can use the `push()` method to add content into the readable internal Buffer.

### Challenge

Implement a Readable stream, initiate a new stream instance from your implementation
and pipe to `process.stdout`.
You will receive the content to add to your stream like first argument.

### Docs
* `stream.Readable`: https://nodejs.org/api/stream.html#stream_class_stream_readable
* `readable._read()`: https://nodejs.org/api/stream.html#stream_readable_read_size_1
* stream reading modes: https://nodejs.org/api/stream.html#stream_two_reading_modes
