const { Readable } = require('stream')

const stream = new Readable({
  read () {}
})

stream.push(process.argv[2])
stream.pipe(process.stdout)
