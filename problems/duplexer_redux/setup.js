var through = require('through');
var cmd = __dirname + '/command.js';
var path = require('path');
var provinces = require('provinces');
var Readable = require('stream').Readable;

module.exports = function () {
    var n = 1 + Math.floor(Math.random() * 25);
    var writes = [];
    var len = 50 + Math.floor(Math.random() * 25);
    for (var i = 0; i < len; i++) {
        var p = provinces[Math.floor(Math.random() * provinces.length)];
        writes.push(p);
    }
    return { a: runCmd, b: runCmd };
    
    function runCmd (args) {
        var fn = require(path.resolve(args[0]));
        var counter = new Readable;
        counter._read = function () {};
        counter.setCounts = function (counts) {
            var self = this;
            Object.keys(counts).sort().forEach(function (key) {
                self.push(key + ' => ' + counts[key] + '\n');
            });
            this.push(null);
        };
        
        var stream = fn(counter);
        
        var queue = writes.slice();
        var iv = setInterval(function () {
            if (queue.length === 0) {
                clearInterval(iv);
                stream.end();
            }
            else stream.write(queue.shift());
        }, 10);
        
        return stream;
    }
};
