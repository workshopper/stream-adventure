var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var concat = require('concat-stream');

var spawn = require('child_process').spawn;
var tmpdir = require('osenv').tmpdir();
var aliens = require('./aliens.json');

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'));

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(3);
    
    t.equal(args.length, 1, 'stream-adventure verify YOURFILE.js');
    var ps = spawn(process.execPath, args);
    ps.stderr.pipe(process.stderr);
    
    var wrote = '';
    ps.stdout.pipe(concat(function (body) {
        t.equal(body.toString(), wrote);
    }));
    
    ps.on('exit', function (code) {
        t.equal(code, 0, 'successful exit code');
    });
    
    var count = 0;
    var iv = setInterval(function () {
        if (++count === 10) {
            clearInterval(iv);
            return ps.stdin.end();
        }
        var alien = aliens[Math.floor(Math.random() * aliens.length)];
        wrote += alien + '\n';
        ps.stdin.write(alien + '\n');
    }, 50);
});
