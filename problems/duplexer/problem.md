Write a program that exports a function that spawns a process from a `cmd`
string and an `args` array and returns a single duplex stream joining together
the stdin and stdout of the spawned process:

```js
const { spawn } = require('child_process')

module.exports = function (cmd, args) {
  // spawn the process and return a single stream
  // joining together the stdin and stdout here
}
```

There is a very handy module you can use here: duplexer2. The duplexer2 module
exports a single function `duplexer2(writable, readable)` that joins together a
writable stream and a readable stream into a single, readable/writable duplex
stream.

If you use duplexer2, make sure to `npm install duplexer2` in the directory where
your solution file is located.

Keep in mind that the main and child processes will have different stream interface.

    process.stdin is a Readable stream
    process.stdout is a Writable stream

For process you're inside the process to stdin is readable to you.
For child process you're outside so that process's stdin is writable to you.

    childProc.stdin is a Writable stream
    childProc.stdout is a Readable stream

Also, have a look at the duplexer2 documentation and notice that singnature
of the exported function is `duplexer2([options], writable, readable)`
which means that you might need to pass an options argument.

Create a new file called duplexer.js which will hold your solution.

To verify your solution run:

```sh
$ {appname} verify duplexer.js
```
