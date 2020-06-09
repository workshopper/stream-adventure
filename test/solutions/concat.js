const concat = require('concat-stream')

process.stdin.pipe(concat(function (src) {
  const s = src.toString().split('').reverse().join('')
  process.stdout.write(s)
}))
