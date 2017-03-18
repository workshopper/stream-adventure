var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var spawn = require('child_process').spawn;

var through = require('through2');
var concat = require('concat-stream');
var http = require('http');
var words = require('./words.json');

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'));


var input = [], expected = '';
var offset = Math.floor(words.length*Math.random());
for (var i = 0; i < 10; i++) {
    var word = words[(offset+i)%words.length];
    input.push(word + '\n');
    expected += convert(word + '\n');
}

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(3);
    t.equal(args.length, 1, 'stream-adventure verify YOURFILE.js');
    
    var server = createServer();
    t.once('end', function () {
        server.close();
    });
    
    server.listen(8099, function () {
        var ps = spawn(process.execPath, args);
        ps.stderr.pipe(process.stderr);
        ps.once('exit', function (code) {
            t.equal(code, 0, 'successful exit code');
        });
        ps.stdout.pipe(concat(function (body) {
            t.equal(body.toString('utf8'), expected);
        }));
        
        var iv = setInterval(function () {
            if (input.length) {
                ps.stdin.write(input.shift());
            }
            else {
                clearInterval(iv);
                ps.stdin.end();
            }
        }, 50);
    });
});

exports.run = function (args) {
    var server = createServer();
    server.listen(8099, function () {
        var ps = spawn(process.execPath, args);
        ps.stderr.pipe(process.stderr);
        ps.once('exit', function (code) {
            server.close();
        });
        ps.stdout.pipe(process.stdout);
        
        var iv = setInterval(function () {
            if (input.length) {
                ps.stdin.write(input.shift());
            }
            else {
                clearInterval(iv);
                ps.stdin.end();
            }
        }, 50);
    });
};

function convert (buf) {
    return buf.toString().replace(/\S/g, function (c) {
        var x = c.charCodeAt(0);
        if (/[a-z]/.test(c)) {
            return String.fromCharCode(137 * (x - 97) % 26 + 97);
        }
        else if (/[A-Z]/.test(c)) {
            return String.fromCharCode(139 * (x - 65) % 26 + 65);
        }
        else return c;
    });
}

function createServer () {
    return http.createServer(function (req, res) {
        if (req.method !== 'POST') {
            return res.end('not a POST request');
        }
        req.pipe(through(function (buf, _, next) {
            this.push(convert(buf));
            next();
        })).pipe(res);
    });
}
