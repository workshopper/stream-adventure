var http = require('http')
var ws = require('ws')
var websocket = require('websocket-stream')
var through = require('through')
var browserify = require('browserify')

module.exports = function () {
  var tr = through()
  var httpServer = http.createServer(httpHandler)
  
  function httpHandler(req, res) {
    if (req.url.match('bundle.js')) {
      res.statusCode = 200
      res.setHeader('content-type', 'text/javascript')
      var bundle = bundleStream('./' + process.argv[3])
      bundle.pipe(res)
      return
    }
    if (req.url === '' || req.url === '/') {
      res.statusCode = 200
      res.setHeader('content-type', 'text/html')
      return res.end('<script src="bundle.js"></script>')
    }
    return res.connection.destroy()
  }

  var wsServer = new ws.Server({ noServer: true, clientTracking: false })
  httpServer.on('upgrade', function (req, socket, head) {
    wsServer.handleUpgrade(req, socket, head, function(conn) {
      var stream = websocket(conn)
      stream.pipe(tr)
      stream.on('end', function() {
        conn.close()
        httpServer.close()
        wsServer.close()
        req.connection.destroy()
      })
    })
  })
  httpServer.listen(9000)
  console.log('\nOpen localhost:9000 to run your code!\n')
  tr.pipe(process.stdout)
  return { args: [], stdin: tr }
};

function bundleStream(entry) {
  var b = browserify()
  b.add(entry)
  return b.bundle()
}