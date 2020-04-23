const http = require('http')

const through = require('through2')

const exercise = require('../../lib/stdinExercise')
const { inputFromWords } = require('../../lib/utils')

exercise.inputStdin = inputFromWords()

function convert (buf) {
  return buf.toString().replace(/\S/g, function (c) {
    const x = c.charCodeAt(0)
    if (/[a-z]/.test(c)) {
      return String.fromCharCode(137 * (x - 97) % 26 + 97)
    } else if (/[A-Z]/.test(c)) {
      return String.fromCharCode(139 * (x - 65) % 26 + 65)
    } else return c
  })
}

exercise.addSetup(function (mode, callback) {
  const port = 8099
  this.server = http.createServer(function (req, res) {
    if (req.method !== 'POST') {
      return res.end('not a POST request')
    }
    req.pipe(through(function (buf, _, next) {
      this.push(convert(buf))
      next()
    })).pipe(res)
  })

  this.server.listen(port, function () {
    callback()
  })
})

exercise.addCleanup(function (mode, passed, callback) {
  if (!this.server) {
    return process.nextTick(callback)
  }

  this.server.close(callback)
})

module.exports = exercise
