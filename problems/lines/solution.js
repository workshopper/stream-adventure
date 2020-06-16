const through = require('through2')
const split2 = require('split2')

let lineCount = 0
const tr = through(function (buf, _, next) {
  const line = buf.toString()
  this.push(lineCount % 2 === 0
    ? line.toLowerCase() + '\n'
    : line.toUpperCase() + '\n'
  )
  lineCount++
  next()
})
process.stdin
  .pipe(split2())
  .pipe(tr)
  .pipe(process.stdout)
