var trumpet = require('../');
var fs = require('fs');
var through = require('through');
var test = require('tape');
var concat = require('concat-stream');

test('outer write stream', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var ws = tr.select('div').createWriteStream({ outer: true });
    var s = through();
    s.pipe(ws);
    
    s.write('<B>beep');
    
    setTimeout(function () {
        s.write(' boop.</B>');
        s.end();
    }, 500);
    
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<!doctype html>\n'
            + '<html>\n<body>\n<B>beep boop.</B>\n</body>\n</html>\n'
        );
    }));
    
    fs.createReadStream(__dirname + '/write_stream.html').pipe(tr);
});

test('write stream', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var ws = tr.select('div').createWriteStream();
    var s = through();
    s.pipe(ws);
    
    s.write('beep');
    
    setTimeout(function () {
        s.write(' boop.');
        s.end();
    }, 500);
    
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<!doctype html>\n'
            + '<html>\n<body>\n<div class="x">beep boop.</div>\n'
            + '</body>\n</html>\n'
        );
    }));
    
    fs.createReadStream(__dirname + '/write_stream.html').pipe(tr);
});
