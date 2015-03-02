var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var concat = require('concat-stream');

var spawn = require('child_process').spawn;
var tmpdir = require('osenv').tmpdir();
var aliens = require('./aliens.json');

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'));


var lines = [];
for (var i = 0; i < 10; i++) {
    lines.push(aliens[Math.floor(Math.random() * aliens.length)]);
}
var data = lines.join('\n') + '\n';

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(3);
    
    t.equal(args.length, 1, 'stream-adventure verify YOURFILE.js')
    
    var file = path.resolve(tmpdir, 'meet-pipe-data.txt');
    fs.writeFileSync(file, data);
    
    var ps = spawn(process.execPath, [ args[0], file ]);
    ps.stderr.pipe(process.stderr);
    
    ps.stdout.pipe(concat(function (body) {
        t.deepEqual(body.toString(), data);
    }));
    ps.on('exit', function (code) {
        t.equal(code, 0, 'successful exit code');
    });
});

exports.run = function (args) {
    var file = path.resolve(tmpdir, 'meet-pipe-data.txt');
    fs.writeFileSync(file, data);
    
    var ps = spawn(process.execPath, [ args[0], file ]);
    ps.stderr.pipe(process.stderr);
    ps.stdout.pipe(process.stdout);
    ps.once('exit', function (code) {
        if (code) process.exit(code)
    });
};
