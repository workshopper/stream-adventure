const http = require('http')
const WebSocket = require('ws')
const exercise = require('../../lib/basicExercise')

const initMsg = 'hello\n'
const responseMsg = 'beep bop boop\n'

exercise.addSetup(function (mode, callback) {
  this.server = http.createServer()
  this.server.listen(8099, function () {
    callback()
  })

  this.wss = new WebSocket.Server({ server: this.server })
  this.wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      const received = data.toString()
      ws.send(received)
      if (received === initMsg) {
        ws.send(responseMsg)
      }
      ws.close()
    })
  })
})

exercise.addCleanup(function (mode, passed, callback) {
  if (!this.server) {
    return process.nextTick(callback)
  }

  this.wss.close()
  this.server.close(callback)
})
module.exports = exercise
