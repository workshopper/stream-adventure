var trumpet = require('../');
var fs = require('fs');
var through = require('through');
var test = require('tape');
var concat = require('concat-stream');

test('outer through stream', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var ts = tr.select('div').createStream({ outer: true });
    ts.pipe(through(function (buf) {
        this.queue(buf.toString().toUpperCase());
    })).pipe(ts);
    
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<html>\n<body>\n<DIV>XYZ</DIV>\n</body>\n</html>\n'
        );
    }));
    
    fs.createReadStream(__dirname + '/through_stream.html').pipe(tr);
});

test('through stream', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var ts = tr.select('div').createStream();
    ts.pipe(through(function (buf) {
        this.queue(buf.toString().toUpperCase());
    })).pipe(ts);
    
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<html>\n<body>\n<div>XYZ</div>\n</body>\n</html>\n'
        );
    }));
    
    fs.createReadStream(__dirname + '/through_stream.html').pipe(tr);
});
