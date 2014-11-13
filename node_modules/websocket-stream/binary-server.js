var WebSocketServer = require('ws').Server
var http = require('http')
var fs = require('fs')
var ecstatic = require('ecstatic')(__dirname)
var server = http.createServer(ecstatic)
var websocketStream = require('./')
server.listen(8080)
var wss = new WebSocketServer({server: server})
wss.on('connection', function(ws) {
  var stream = websocketStream(ws)
  for (var i = 0; i < 5; i++) stream.write(new Buffer(100))
  stream.end()
})