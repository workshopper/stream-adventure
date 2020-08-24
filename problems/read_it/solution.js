const { Readable } = require('stream')

class ReadableStream extends Readable {
  _read (size) {
  }
}

const stream = new ReadableStream(process.argv[2])
stream.push(process.argv[2])
stream.pipe(process.stdout)
