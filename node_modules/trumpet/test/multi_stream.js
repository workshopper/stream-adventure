var trumpet = require('../');
var test = require('tape');
var fs = require('fs');
var through = require('through');
var concat = require('concat-stream');

test('multiple read streams', function (t) {
    t.plan(7);
    var tr = trumpet();
    tr.pipe(through(null, function () { output.end() }));
    
    var output = through();
    output.pipe(concat(function (src) {
        t.equal(src.toString('utf8'), 'tacosyburritos');
    }));
    
    var html = [
        'tacos',
        'y',
        'burritos'
    ];
    tr.selectAll('.b span', function (span) {
        t.equal(span.name, 'span');
        var rs = span.createReadStream();
        rs.pipe(output, { end: false });
        rs.pipe(concat(function (src) {
            t.equal(src.toString('utf8'), html.shift());
        }));
    });
    fs.createReadStream(__dirname + '/multi_stream.html').pipe(tr);
});
