var trumpet = require('../');
var tr = trumpet();
var through = require('through');
tr.pipe(process.stdout);

tr.selectAll('.x span', function (span) {
    var stream = span.createStream();
    stream.pipe(through(write, end)).pipe(stream)
    
    function write (buf) {
        var self = this;
        setTimeout(function () {
            self.queue(buf.toString().toUpperCase());
        }, 100);
    }
    function end () {
        var self = this;
        setTimeout(function () {
            self.queue(null);
        }, 100);
    }
});

var fs = require('fs');
fs.createReadStream(__dirname + '/html/uppercase.html').pipe(tr);
