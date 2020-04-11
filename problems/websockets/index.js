const path = require('path')
const http = require('http')
const websocket = require('websocket-stream')
const split = require('split')
const through = require('through2')
const comparestdout = require('workshopper-exercise/comparestdout')

let exercise = require('../../lib/exercise')

exercise.solution = path.join(__dirname, 'solution.js')

exercise.addSetup(function (mode, callback) {
  this.server = http.createServer()
  this.server.listen(8099, function () {
    callback()
  })

  this.wss = websocket.createServer({ server: this.server }, handle)
  function handle (stream) {
    stream.pipe(split()).pipe(through(function (buf, enc, next) {
      exercise.wsMsg = buf.toString()
      stream.end()
    }))
  }
})

exercise = comparestdout(exercise)

exercise.addVerifyProcessor(function (callback) {
  const passed = this.wsMsg === 'hello'

  if (passed) {
    this.emit('pass', this.__('pass.message'))
  } else {
    this.emit('fail', this.__('fail.message'))
  }

  callback(null, passed)
})

exercise.addCleanup(function (mode, passed, callback) {
  if (!this.server) {
    return process.nextTick(callback)
  }

  this.wss.close()
  this.server.close(callback)
})
module.exports = exercise
