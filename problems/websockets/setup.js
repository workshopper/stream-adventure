var http = require('http')
var ws = require('ws')
var websocket = require('websocket-stream')
var through = require('through')
var browserify = require('browserify')

var path = require('path');
var entry = path.resolve(process.argv[3]);

module.exports = function () {
    var actual = through()
    var expected = through().pause()
    expected.queue('hello\n')
    expected.queue(null);
    
    var httpServer = http.createServer(function (req, res) {
        if (req.url === '/bundle.js') {
            res.setHeader('content-type', 'text/javascript');
            browserify(entry).bundle({ debug: true }, function (err, src) {
                if (err) console.error(err);
                res.end(src);
            });
        }
        else {
            res.setHeader('content-type', 'text/html')
            return res.end('<script src="/bundle.js"></script>')
        }
    });
    
    var wsServer = new ws.Server({ noServer: true, clientTracking: false })
    httpServer.on('upgrade', function (req, socket, head) {
        httpServer.on('_close', function () {
            socket.destroy();
        });
        wsServer.handleUpgrade(req, socket, head, function(conn) {
            var stream = websocket(conn)
            stream.pipe(actual);
        });
    });
    httpServer.listen(8000);
    
    console.log('################################################');
    console.log('#                                              #');
    console.log('# Open http://localhost:8000 to run your code! #');
    console.log('#                                              #');
    console.log('################################################');
    console.log();
    
    return {
        args: [],
        a: actual,
        b: expected,
        close: function () {
            httpServer.close();
            httpServer.emit('_close');
            wsServer.close();
            setTimeout(process.exit, 50);
        }
    };
};
