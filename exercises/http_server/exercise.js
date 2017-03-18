var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var spawn = require('child_process').spawn;

var concat = require('concat-stream');
var hyperquest = require('hyperquest');
var words = require('./words.json');

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'));

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(2);
    t.equal(args.length, 1, 'stream-adventure verify YOURFILE.js');
    
    var port = Math.floor(Math.random() * 40000 + 10000);
    var ps = spawn(process.execPath, [ args[0], port ]);
    
    var expected = [], input = [];
    var offset = Math.floor(words.length*Math.random());
    for (var i = 0; i < 10; i++) {
        var word = words[(offset+i)%words.length];
        input.push(word + '\n');
        expected.push(word.toUpperCase() + '\n');
    }
    
    ps.stderr.pipe(process.stderr);
    ps.stdout.pipe(process.stdout);
        
    (function retry (n) {
        if (n > 6) return t.fail('server not running');
        
        var hq = hyperquest.post('http://localhost:' + port);
        hq.on('error', function (err) {
            clearInterval(iv);
            if (err.code === 'ECONNREFUSED') {
                setTimeout(function () { retry(n + 1) }, 200);
            }
            else t.ifError(err);
        });
        
        hq.pipe(concat(function (body) {
            t.equal(body.toString(), expected.join(''));
            ps.kill();
        }));
        var iv = setInterval(function () {
            if (input.length) {
                hq.write(input.shift());
            }
            else {
                clearInterval(iv);
                hq.end();
            }
        }, 50);
    })(0);
});

exports.run = function (args) {
    var port = Math.floor(Math.random() * 40000 + 10000);
    var ps = spawn(process.execPath, [ args[0], port ]);
    
    var input = [];
    var offset = Math.floor(words.length*Math.random());
    for (var i = 0; i < 10; i++) {
        var word = words[(offset+i)%words.length];
        input.push(word + '\n');
    }
    
    ps.stderr.pipe(process.stderr);
    ps.stdout.pipe(process.stdout);
    ps.once('exit', function (code) {
        if (code) process.exit(code)
    });
    
    (function retry (n) {
        if (n > 6) return t.fail('server not running');
        
        var hq = hyperquest.post('http://localhost:' + port);
        hq.on('error', function (err) {
            clearInterval(iv);
            if (err.code === 'ECONNREFUSED') {
                setTimeout(function () { retry(n + 1) }, 200);
            }
            else t.ifError(err);
        });
        
        hq.on('end', function () { ps.kill() });
        hq.pipe(process.stdout);
        
        var iv = setInterval(function () {
            if (input.length) {
                hq.write(input.shift());
            }
            else {
                clearInterval(iv);
                hq.end();
            }
        }, 50);
    })(0);
};
