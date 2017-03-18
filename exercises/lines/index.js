var through = require('through2');
var chunky = require('chunky');
var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var concat = require('concat-stream');

var data = fs.readFileSync(path.join(__dirname, 'finnegans_wake.txt'), 'utf8');

var spawn = require('child_process').spawn;

/*
module.exports = function () {
    var tr = through();
    var chunks = chunky(data);
    var iv = setInterval(function () {
        var buf = chunks.shift();
        if (!buf) { clearInterval(iv); tr.end() }
        else tr.write(buf)
    }, 50);
    
    return { args: [], stdin: tr, long: true };
};
*/

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'));

var input = data.split('\n');

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(3);
    
    t.equal(args.length, 1, 'stream-adventure verify YOURFILE.js');
    
    var expected = data.split('\n').map(function (line, ix) {
        return (ix % 2 ? line.toUpperCase() : line.toLowerCase()) + '\n';
    }).join('');
    
    var ps = spawn(process.execPath, args);
    ps.stderr.pipe(process.stderr);
    
    ps.stdout.pipe(concat(function (body) {
        t.equal(body.toString().trim(), expected.trim());
    }));
    
    ps.on('exit', function (code) {
        t.equal(code, 0, 'successful exit code');
    });
    
    var iv = setInterval(function () {
        if (input.length) {
            ps.stdin.write(input.shift() + '\n');
        }
        else {
            ps.stdin.end();
            clearInterval(iv);
        }
    }, 50);
});

exports.run = function (args) {
    var ps = spawn(process.execPath, args);
    ps.stderr.pipe(process.stderr);
    ps.stdout.pipe(process.stdout);
    ps.once('exit', function (code) {
        if (code) process.exit(code)
    });
    
    var iv = setInterval(function () {
        if (input.length) {
            ps.stdin.write(input.shift() + '\n');
        }
        else {
            clearInterval(iv);
            ps.stdin.end();
        }
    }, 50);
};
