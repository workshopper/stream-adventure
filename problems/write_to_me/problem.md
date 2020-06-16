## Writable Streams

To create a custom `Writable` stream you must call the `new stream.Writable(options)`
constructor and implement the `_write()` and/or `_writev()` method

```js
  const { Writable } = require('stream')

  const myWritable = new Writable({
    write(chunk, encoding, callback) {}
  })
```

or

```js
  const { Writable } = require('stream')

  class MyCustomWritable extends Writable {
    _write(chunk, encoding, callback) {
      // ...
    }
  }
```

### `_write` method

The `_write` method is used to send data to the underlying resource.
This method MUST NOT be called by your application code directly. Instead it's
called by internal `Writable` class methods only.

The method receive the following arguments:

* `chunk` is the value to be written, commonly a Buffer converted from the
string you passed to `stream.write()`.
* `encoding`, if the chunk is a string, will be the character encoding for the
string. Otherwise it may be ignored.
* `callback` function that will be called when the processing for the supplied
chunk is complete.

The callback function receive one argument, this argument must be an `Error`
object if the write process fail or `null` if succeded.

### Using a Writable stream

To write data to a writable stream you need to call the `write()` method on the
stream instance.

```js
  readable.on('data', (chunk) => {
    writable.write(chunk)
  })
```

Also you can use the `pipe` method, like we learn before.

### Challenge

Implement a writable stream that writes in console `writing: ` + the given chunk
And pipe it to `process.stdin`
