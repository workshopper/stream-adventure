const through = require('through2')

const tr = through(function (buf, _, next) {
  this.push(buf.toString().toUpperCase())
  next()
})
process.stdin.pipe(tr).pipe(process.stdout)
