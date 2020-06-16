const { Writable } = require('stream')

const stream = new Writable({
  write (chunk, encoding, callback) {
    console.log(`writing: ${chunk.toString()}`)
    callback()
  }
})

process.stdin.pipe(stream)
