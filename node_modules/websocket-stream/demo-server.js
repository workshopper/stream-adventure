var WebSocketServer = require('ws').Server
var http = require('http')
var fs = require('fs')
var ecstatic = require('ecstatic')(__dirname)
var server = http.createServer(ecstatic)
var stringStream = require('stringstream')
var websocketStream = require('./')
server.listen(8080)
var wss = new WebSocketServer({server: server})
wss.on('connection', function(ws) {
  var stream = websocketStream(ws)
  var pj = fs.createReadStream('package.json')
  pj.pipe(stringStream()).pipe(stream)
  console.log('started stream')
  stream.on('end', function() {
    console.log('stream ended')
  })
})