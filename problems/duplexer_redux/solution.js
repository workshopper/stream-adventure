var duplexer = require('duplexer');
var through = require('through');

module.exports = function (counter) {
    var bytes = 0;
    var input = through(write, end);
    return duplexer(input, counter);
    
    function write (buf) { bytes += buf.length }
    function end () { counter.set(bytes) }
};
