In this example, you will be given a readable stream, `counter`, as the first
argument to your exported function:

```js
module.exports = function (counter) {
  // return a duplex stream to count countries on the writable side
  // and pass through `counter` on the readable side
}
```

Return a duplex stream with the `counter` as the readable side. You will be
written objects with a 2-character `country` field as input, such as these:

```json
  {"short":"OH","name":"Ohio","country":"US"}
  {"name":"West Lothian","country":"GB","region":"Scotland"}
  {"short":"NSW","name":"New South Wales","country":"AU"}
```

Create an object to track the number of occurrences of each unique country code.

For example:
```json
  {"US": 2, "GB": 3, "CN": 1}
```

Once the input ends, call `counter.setCounts()` with your counts object.

The `duplexer2` module will again be very handy in this example.

If you use duplexer, make sure to `npm install duplexer2` in the directory where
your solution file is located.

Keep in mind that you will have to work with objects, not buffers.
Consult the documentation for further details:
https://nodejs.org/api/stream.html#stream_object_mode

When you switch on the object mode, remember to do the same for all 
additional dependencies that you work with (i.e. through2)

Create a new file called duplexer-redux.js which will hold your solution.

To verify your solution run:

```sh
$ {appname} verify duplexer-redux.js
```
