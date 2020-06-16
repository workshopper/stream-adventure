const { Writable } = require('stream')

class MyWritable extends Writable {
  _write (chunk, encoding, callback) {
    console.log(`writing: ${chunk.toString()}`)
    callback()
  }
}

const stream = new MyWritable()
process.stdin.pipe(stream)
