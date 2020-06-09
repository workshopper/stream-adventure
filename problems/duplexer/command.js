const through = require('through2')
const split = require('split')
const combine = require('stream-combiner')
const offset = Number(process.argv[2])

const tr = combine(split(), through(write))
process.stdin.pipe(tr).pipe(process.stdout)

function write (buf, _, next) {
  const line = buf.toString()
  this.push(line.replace(/[A-Za-z]/g, function (s) {
    const c = s.charCodeAt(0)
    return String.fromCharCode(
      c < 97
        ? (c - 97 + offset) % 26 + 97
        : (c - 65 + offset) % 26 + 97
    )
  }) + '\n')
  next()
}
