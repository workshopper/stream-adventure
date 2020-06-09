An encrypted, gzipped tar file will be piped in on process.stdin. To beat this
challenge, for each file in the tar input, print a hex-encoded md5 hash of the
file contents followed by a single space followed by the file path, then a
newline.

You will receive the cipher algorithm name as process.argv[2], the cipher key as
process.argv[3] and the cipher initialization vector as process.argv[4].
You can pass these arguments directly through to `crypto.createDecipheriv()`.

The built-in zlib library you get when you `require('zlib')` has a
`zlib.createGunzip()` that returns a stream for gunzipping.

The `tar` module from npm has a `tar.Parse()` function that emits `'entry'`
events for each file in the tar input. Each `entry` object is a readable stream
of the file contents from the archive and:

    `entry.type` is the kind of file ('File', 'Directory', etc)
    `entry.path` is the file path

Using the tar module looks like:

```js
const tar = require('tar')
const parser = new tar.Parse()
parser.on('entry', function (e) {
    console.dir(e)
});
const fs = require('fs')
fs.createReadStream('file.tar').pipe(parser)
```

Use `crypto.createHash('md5', { encoding: 'hex' })` to generate a stream that
outputs a hex md5 hash for the content written to it.

The `concat-stream` module could be useful to concatenate all stream data.

Make sure to run `npm install tar concat-stream` in the directory where your solution
file lives.
