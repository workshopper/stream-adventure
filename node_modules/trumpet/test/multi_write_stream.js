var trumpet = require('../');
var fs = require('fs');
var through = require('through');
var test = require('tape');
var concat = require('concat-stream');

test('multi write stream in order', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var wsx = tr.select('.x').createWriteStream();
    var wsy = tr.select('.y').createWriteStream();
    var sx = through();
    var sy = through();

    sx.pipe(wsx);
    sy.pipe(wsy);
    
    sx.write('beep');
    sy.write('beep');
    
    setTimeout(function () {
        sx.write(' boop.');
        sx.end();
    }, 500);
    
    setTimeout(function () {
        sy.write(' beep boop.');
        sy.end();
    }, 600);

    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<!doctype html>\n'
            + '<html>\n<body>\n<div class="x">beep boop.</div>\n'
            + '<div class="y">beep beep boop.</div>\n'
            + '</body>\n</html>\n'
        );
    }));
    
    fs.createReadStream(__dirname + '/multi_write_stream.html').pipe(tr);
});
