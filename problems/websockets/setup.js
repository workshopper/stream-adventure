var http = require('http')
var wsock = require('websocket-stream')
var through = require('through2')
var browserify = require('browserify')

var path = require('path');
var entry = path.resolve(process.argv[3]);

module.exports = function () {
    var actual = through()
    var expected = through()
    expected.push('hello\n')
    expected.end();
    
    var server = http.createServer(function (req, res) {
        if (req.url === '/bundle.js') {
            res.setHeader('content-type', 'text/javascript');
            var b = browserify(entry, { debug: true });
            b.bundle().pipe(res);
        }
        else {
            res.setHeader('content-type', 'text/html')
            return res.end('<script src="/bundle.js"></script>')
        }
    });
    
    var wss = wsock.createServer({ server: server }, handle);
    function handle (stream) {
        stream.pipe(actual);
    }
    server.listen(8000);
    
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
            server.close();
            setTimeout(process.exit, 50);
        }
    };
};
