const split2 = require('split2')
const through = require('through2')

let count = 0
process.stdin.pipe(split2()).pipe(through(function (line, _, next) {
  if (count++ % 2) {
    this.push(line.toString().toUpperCase() + '\n')
  } else {
    this.push(line.toString().toLowerCase() + '\n')
  }
  next()
})).pipe(process.stdout)
