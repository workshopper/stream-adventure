var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var spawn = require('child_process').spawn;

var http = require('http')
var wsock = require('websocket-stream')
var browserify = require('browserify')

var split = require('split');
var concat = require('concat-stream')
var through = require('through2');

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = function () {
    var r = fs.createReadStream(path.join(__dirname, 'solution.js'));
    r.once('end', function () {
        setTimeout(function () { process.exit(0) }, 500);
    });
    return r;
};

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(1);
    var server = createServer(path.resolve(args[0]));
    t.once('end', function () {
        server.close();
        wss.close();
    });
    
    var wss = wsock.createServer({ server: server }, handle);
    function handle (stream) {
        stream.pipe(split()).pipe(through(function (buf, enc, next) {
            t.equal(buf.toString(), 'hello');
            stream.end();
        }));
    }
});

exports.run = function (args) {
    var server = createServer(path.resolve(args[0]));
    var wss = wsock.createServer({ server: server }, handle);
    function handle (stream) {
        stream.pipe(process.stdout);
    }
};

function createServer (main) {
    var server = http.createServer(function (req, res) {
        if (req.url === '/bundle.js') {
            res.setHeader('content-type', 'text/javascript');
            var b = browserify(main, { debug: true });
            b.bundle().pipe(res);
        }
        else {
            res.setHeader('content-type', 'text/html')
            return res.end('<script src="/bundle.js"></script>')
        }
    });
    server.listen(8099, function () {
        console.log('################################################');
        console.log('#                                              #');
        console.log('# Open http://localhost:8099 to run your code! #');
        console.log('#                                              #');
        console.log('################################################');
        console.log();
    });
    return server;
}
