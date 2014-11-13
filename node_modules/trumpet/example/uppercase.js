var trumpet = require('../');
var tr = trumpet();
var through = require('through');
tr.pipe(process.stdout);

tr.selectAll('.x span', function (span) {
    var stream = span.createStream();
    stream.pipe(through(function (buf) {
        this.queue(buf.toString().toUpperCase());
    })).pipe(stream);
});

var fs = require('fs');
fs.createReadStream(__dirname + '/html/uppercase.html').pipe(tr);
