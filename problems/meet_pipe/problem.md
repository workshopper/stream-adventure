## What are streams?

A stream is an abstract interface for working with streaming data in Node.js.

That means you can consume data as is loaded or produced, chunk by chunk (or
piece by piece), instead get all in memory.

Streams can be readable, writable, or both.

There are four types of streams:

* `Readable` stream, which data can be read.
* `Writable` stream, which data can be written.
* `Duplex` stream, which is both `Readable` and `Writable`.
* `Transform` stream, which is a `Duplex` stream that can modify or transform
  the data as it is written and read.

Streams are present in many Node.js modules, for example `http.request()`,
`zlib.createGzip()`, `fs.createReadStream()`, `process.stdout` ... all of these
return streams.

## The `pipe` method

The `pipe` method allow you to connect the output of the readable stream as the
input of the writable stream

```js
readable.pipe(writable)
```

If you pipe into a duplex stream you can chain to other stream.

```js
readable.pipe(duplex).pipe(writable)
```

## Challenge

You will get a file as the first argument to your program (process.argv[2]).

Use `fs.createReadStream()` to pipe the given file to `process.stdout`.

`fs.createReadStream()` takes a file as an argument and returns a readable
stream that you can call `.pipe()` on. Here's a readable stream that pipes its
data to `process.stderr`:

```js
const fs = require('fs')
fs.createReadStream('data.txt').pipe(process.stderr)
```

Your program is basically the same idea, but instead of `'data.txt'`, the
filename comes from `process.argv[2]` and you should pipe to stdout, not stderr.
