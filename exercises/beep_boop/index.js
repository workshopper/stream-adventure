var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var concat = require('concat-stream');
var spawn = require('child_process').spawn;

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'));

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(3);
    
    t.equal(args.length, 1, 'stream-adventure verify YOURFILE.js')
    
    var ps = spawn(process.execPath, args);
    ps.stderr.pipe(process.stderr);
    
    ps.stdout.pipe(concat(function (body) {
        t.equal(body.toString(), 'beep boop\n');
    }));
    ps.on('exit', function (code) {
        t.equal(code, 0, 'successful exit code');
    });
});

exports.run = function (args) {
    var ps = spawn(process.execPath, args);
    ps.stderr.pipe(process.stderr);
    ps.stdout.pipe(process.stdout);
    ps.once('exit', function (code) {
        if (code) process.exit(code)
    });
};
