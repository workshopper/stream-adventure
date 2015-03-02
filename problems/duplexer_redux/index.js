var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var concat = require('concat-stream');

var cmd = __dirname + '/command.js';
var path = require('path');
var provinces = require('provinces');
var Readable = require('stream').Readable;

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'));

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(3);
    t.equal(args.length, 1, 'stream-adventure verify YOURFILE.js');
    var fn = require(path.resolve(args[0]));
    t.equal(typeof fn, 'function', 'solution exports a function');
    
    var n = 1 + Math.floor(Math.random() * 25);
    var input = [], counts = {};
    var len = 50 + Math.floor(Math.random() * 25);
    for (var i = 0; i < len; i++) {
        var p = provinces[Math.floor(Math.random() * provinces.length)];
        counts[p.country] = (counts[p.country] || 0) + 1;
        input.push(p);
    }
    
    var counter = new Readable({objectMode: true});
    counter._read = function () {};
    counter.setCounts = function (counts) {
        var self = this;
        Object.keys(counts).sort().forEach(function (key) {
            self.push(key + ' => ' + counts[key] + '\n');
        });
        this.push(null);
    };
    
    var stream = fn(counter);
    stream.pipe(concat(function (body) {
        var expected = Object.keys(counts).sort().map(function (key) {
            return key + ' => ' + counts[key] + '\n';
        }).join('');
        t.equal(body.toString(), expected);
    }));
    
    var iv = setInterval(function () {
        if (input.length) {
            stream.write(input.shift());
        }
        else {
            clearInterval(iv);
            stream.end();
        }
    }, 10);
});

exports.run = function (args) {
    var fn = require(path.resolve(args[0]));
    
    var n = 1 + Math.floor(Math.random() * 25);
    var input = [], counts = {};
    var len = 50 + Math.floor(Math.random() * 25);
    for (var i = 0; i < len; i++) {
        var p = provinces[Math.floor(Math.random() * provinces.length)];
        counts[p.country] = (counts[p.country] || 0) + 1;
        input.push(p);
    }
    
    var counter = new Readable({objectMode: true});
    counter._read = function () {};
    counter.setCounts = function (counts) {
        var self = this;
        Object.keys(counts).sort().forEach(function (key) {
            self.push(key + ' => ' + counts[key] + '\n');
        });
        this.push(null);
    };
    
    var stream = fn(counter);
    stream.pipe(process.stdout);
    
    var iv = setInterval(function () {
        if (input.length) {
            stream.write(input.shift());
        }
        else {
            clearInterval(iv);
            stream.end();
        }
    }, 10);
};
