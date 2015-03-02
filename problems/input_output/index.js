var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var concat = require('concat-stream');

var spawn = require('child_process').spawn;
var tmpdir = require('osenv').tmpdir();
var aliens = require('./aliens.json');

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'));

var expected = '', input = [];
for (var i = 0; i < 10; i++) {
    var alien = aliens[Math.floor(Math.random() * aliens.length)];
    expected += alien + '\n';
    input.push(alien + '\n');
}

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(3);
    
    t.equal(args.length, 1, 'stream-adventure verify YOURFILE.js');
    var ps = spawn(process.execPath, args);
    ps.stderr.pipe(process.stderr);
    
    ps.stdout.pipe(concat(function (body) {
        t.equal(body.toString(), expected);
    }));
    
    ps.on('exit', function (code) {
        t.equal(code, 0, 'successful exit code');
    });
    
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

exports.run = function (args) {
    var ps = spawn(process.execPath, args);
    ps.stderr.pipe(process.stderr);
    ps.stdout.pipe(process.stdout);
    ps.once('exit', function (code) {
        if (code) process.exit(code)
    });
    
    var iv = setInterval(function () {
        if (input.length) {
            ps.stdin.write(input.shift());
        }
        else {
            clearInterval(iv);
            ps.stdin.end();
        }
    }, 50);
};
