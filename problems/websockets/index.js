const http = require('http')
const websocket = require('websocket-stream')
const split = require('split')
const through = require('through2')
const exercise = require('../../lib/basicExercise')

const initMsg = 'hello\n'
const responseMsg = 'beep bop boop\n'

exercise.addSetup(function (mode, callback) {
  this.server = http.createServer()
  this.server.listen(8099, function () {
    callback()
  })

  this.wss = websocket.createServer({ server: this.server }, handle)
  function handle (stream) {
    stream.pipe(split()).pipe(through(function (buf, enc, next) {
      const received = buf.toString()
      stream.write(`${received}\n`)
      if (received === initMsg.trim()) {
        stream.write(responseMsg)
      }
      stream.end()
    }))
  }
})

exercise.addCleanup(function (mode, passed, callback) {
  if (!this.server) {
    return process.nextTick(callback)
  }

  this.wss.close()
  this.server.close(callback)
})
module.exports = exercise
